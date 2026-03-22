import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Save, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/integrations/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import {
  fetchDepartmentStatistics,
  saveDepartmentStatistics,
  STAT_DEPARTMENT_IDS,
  type StatDepartmentId,
} from '@/integrations/firebase/departmentStatistics';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const ROWS_JSON_PLACEHOLDER = `[
  ["2023", "Ratnapura", "Paddy (MT)", "125,000"],
  ["2023", "Kegalle", "Paddy (MT)", "98,000"]
]`;

function parseRowsJsonToMatrix(rowsJson: string, colCount: number): string[][] {
  const parsed = JSON.parse(rowsJson) as unknown;
  if (!Array.isArray(parsed)) throw new Error('Rows must be a JSON array');

  if (parsed.length === 0) return [];

  const first = parsed[0];
  if (Array.isArray(first)) {
    return parsed.map((row: unknown) => {
      if (!Array.isArray(row)) throw new Error('Each row must be an array');
      return row.map((c) => String(c));
    });
  }

  // One row written as a flat array, e.g. ["2023","Ratnapura","Paddy (MT)","125,000"]
  const single = parsed.map((c) => String(c));
  if (single.length !== colCount) {
    throw new Error(
      `This row has ${single.length} values but there are ${colCount} columns. For multiple rows, nest each row: [["a","b"],["c","d"]].`
    );
  }
  return [single];
}

const AdminStatisticsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [department, setDepartment] = React.useState<StatDepartmentId>('agriculture');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [columnsInput, setColumnsInput] = React.useState('Year, District, Metric, Value');
  const [rowsJson, setRowsJson] = React.useState('[]');
  const [source, setSource] = React.useState('');
  const [lastUpdated, setLastUpdated] = React.useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [methodology, setMethodology] = React.useState('');

  const loadDepartment = async (id: StatDepartmentId) => {
    try {
      setIsLoading(true);
      const data = await fetchDepartmentStatistics(id);
      if (data && data.columns.length > 0) {
        setColumnsInput(data.columns.join(', '));
        setRowsJson(JSON.stringify(data.rows, null, 2));
        setSource(data.metadata.source);
        setLastUpdated(data.metadata.lastUpdated || new Date().toISOString().slice(0, 10));
        setMethodology(data.metadata.methodology);
      } else {
        setColumnsInput('Year, District, Metric, Value');
        setRowsJson('[]');
        setSource('');
        setLastUpdated(new Date().toISOString().slice(0, 10));
        setMethodology('');
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to load statistics',
        description: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setIsAuthReady(true);
      if (!current) navigate('/admin', { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  React.useEffect(() => {
    if (!user) return;
    void loadDepartment(department);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cols = columnsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (cols.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Columns required',
        description: 'Enter at least one column name, comma-separated.',
      });
      return;
    }

    let rowsParsed: string[][];
    try {
      rowsParsed = parseRowsJsonToMatrix(rowsJson, cols.length);
      for (const row of rowsParsed) {
        if (row.length !== cols.length) {
          throw new Error(
            `Each row must have ${cols.length} values (same as columns). Found ${row.length}.`
          );
        }
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid rows JSON',
        description: err?.message ?? 'Check the format.',
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveDepartmentStatistics({
        id: department,
        columns: cols,
        rows: rowsParsed,
        metadata: {
          source: source.trim(),
          lastUpdated: lastUpdated.trim(),
          methodology: methodology.trim(),
        },
      });
      toast({ title: 'Statistics saved', description: 'Changes are live on the public site.' });
    } catch (err: unknown) {
      console.error(err);
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: 'destructive',
        title: 'Failed to save',
        description:
          code === 'permission-denied'
            ? 'Firestore denied write. Add rules for collection "department_statistics" and sign in as admin.'
            : [code, message].filter(Boolean).join(' — ') || 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deptLabel = (id: StatDepartmentId) =>
    t.departments[id as keyof typeof t.departments] ?? id;

  if (!isAuthReady) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gov-hero py-16">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground">
                {t.nav.home}
              </Link>
              <span>/</span>
              <Link to="/admin" className="hover:text-primary-foreground">
                {t.nav.admin}
              </Link>
              <span>/</span>
              <span>{t.nav.statistics}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Statistics data
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Edit table data per department (Firestore only — no file storage).
            </p>
            <div className="mt-6">
              <AdminCategoryTabs />
            </div>
          </div>
        </div>
      </section>

      {user && (
        <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Department dataset</h2>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Configure table
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="stat-dept">Department</Label>
                        <select
                          id="stat-dept"
                          className="border rounded-md px-3 py-2 w-full bg-background"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value as StatDepartmentId)}
                        >
                          {STAT_DEPARTMENT_IDS.map((id) => (
                            <option key={id} value={id}>
                              {deptLabel(id)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stat-columns">Columns (comma-separated)</Label>
                        <Input
                          id="stat-columns"
                          value={columnsInput}
                          onChange={(e) => setColumnsInput(e.target.value)}
                          placeholder="Year, District, Metric, Value"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stat-rows">Rows (JSON array of arrays)</Label>
                        <textarea
                          id="stat-rows"
                          className="border rounded-md px-3 py-2 w-full min-h-[220px] font-mono text-sm bg-background"
                          value={rowsJson}
                          onChange={(e) => setRowsJson(e.target.value)}
                          spellCheck={false}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use an <strong>array of rows</strong>. One row can be written as a flat array:{' '}
                          <code className="text-xs whitespace-pre-wrap break-all">
                            [&quot;2023&quot;,&quot;Ratnapura&quot;,&quot;Paddy (MT)&quot;,&quot;125,000&quot;]
                          </code>
                          . Multiple rows:{' '}
                          <code className="text-xs">[[&quot;2023&quot;,&quot;R&quot;,...],[&quot;2022&quot;,...]]</code>
                          . Each row must match the number of columns you entered above.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stat-source">{t.statistics.source}</Label>
                        <Input
                          id="stat-source"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stat-updated">{t.statistics.lastUpdated}</Label>
                        <Input
                          id="stat-updated"
                          type="date"
                          value={lastUpdated.length >= 10 ? lastUpdated.slice(0, 10) : lastUpdated}
                          onChange={(e) => setLastUpdated(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stat-method">{t.statistics.methodology}</Label>
                        <textarea
                          id="stat-method"
                          className="border rounded-md px-3 py-2 w-full min-h-[80px] bg-background"
                          value={methodology}
                          onChange={(e) => setMethodology(e.target.value)}
                        />
                      </div>

                      <Button type="submit" className="gov-btn-primary" disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving…' : 'Save statistics'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AdminStatisticsPage;
