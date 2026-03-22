import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table2, Download, Calendar, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  STAT_DEPARTMENT_IDS,
  fetchDepartmentStatistics,
  type DepartmentStatistics,
  type StatDepartmentId,
} from '@/integrations/firebase/departmentStatistics';

function isStatDepartmentId(id: string | undefined): id is StatDepartmentId {
  return !!id && (STAT_DEPARTMENT_IDS as readonly string[]).includes(id);
}

function rowsToRecords(
  columns: string[],
  rows: string[][]
): Record<string, string>[] {
  return rows.map((cells) => {
    const o: Record<string, string> = {};
    columns.forEach((col, i) => {
      o[col] = cells[i] ?? '';
    });
    return o;
  });
}

function findColumnKey(columns: string[], ...candidates: string[]): string | null {
  const lower = columns.map((c) => c.toLowerCase());
  for (const cand of candidates) {
    const idx = lower.indexOf(cand.toLowerCase());
    if (idx >= 0) return columns[idx]!;
  }
  return null;
}

function toCsv(columns: string[], rows: string[][]): string {
  const esc = (s: string) => {
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [columns.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
}

const StatisticsDepartmentPage: React.FC = () => {
  const { t } = useLanguage();
  const { department } = useParams<{ department: string }>();
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [dataset, setDataset] = useState<DepartmentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStatDepartmentId(department)) {
      setDataset(null);
      setIsLoading(false);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchDepartmentStatistics(department);
        if (!cancelled) setDataset(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load statistics.');
          setDataset(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [department]);

  const deptName = department
    ? t.departments[department as keyof typeof t.departments] ?? department
    : '';

  const records = useMemo(() => {
    if (!dataset || dataset.columns.length === 0) return [];
    return rowsToRecords(dataset.columns, dataset.rows);
  }, [dataset]);

  const yearKey = dataset
    ? findColumnKey(dataset.columns, 'Year', 'year')
    : null;
  const districtKey = dataset
    ? findColumnKey(dataset.columns, 'District', 'district')
    : null;

  const filteredRows = useMemo(() => {
    let list = [...records];
    if (yearKey && yearFilter !== 'all') {
      list = list.filter((r) => r[yearKey] === yearFilter);
    }
    if (districtKey && districtFilter !== 'all') {
      list = list.filter((r) => r[districtKey] === districtFilter);
    }
    return list;
  }, [records, yearFilter, districtFilter, yearKey, districtKey]);

  const years = useMemo(() => {
    if (!yearKey) return [] as string[];
    return [...new Set(records.map((r) => r[yearKey]).filter(Boolean))].sort();
  }, [records, yearKey]);

  const districts = useMemo(() => {
    if (!districtKey) return [] as string[];
    return [...new Set(records.map((r) => r[districtKey]).filter(Boolean))].sort();
  }, [records, districtKey]);

  const handleDownloadCsv = () => {
    if (!dataset || dataset.columns.length === 0) return;
    const csv = toCsv(dataset.columns, dataset.rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statistics-${department ?? 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!department || !isStatDepartmentId(department)) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Department not found.</p>
            <Link to="/statistics" className="text-primary hover:underline">
              {t.common.back} to Statistics
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.statistics, path: '/statistics' }, { label: deptName }]}
        title={deptName}
        subtitle={t.statistics.subtitle}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          {loadError && (
            <p className="text-destructive text-center mb-6" role="alert">
              {loadError}
            </p>
          )}

          {isLoading && !loadError && (
            <p className="text-center text-muted-foreground py-12">{t.common.loading}</p>
          )}

          {!isLoading && !loadError && (!dataset || dataset.columns.length === 0) && (
            <p className="text-center text-muted-foreground py-12">
              No statistics have been published for this department yet.
            </p>
          )}

          {!isLoading && !loadError && dataset && dataset.columns.length > 0 && (
            <>
              <div className="flex flex-wrap gap-4 items-center mb-6">
                {yearKey && (
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {districtKey && (
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" size="sm" type="button" onClick={handleDownloadCsv}>
                  <Download className="h-4 w-4 mr-2" />
                  {t.statistics.download}
                </Button>
              </div>

              <Card className="gov-card mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <FileText className="h-4 w-4" />
                    <span>
                      {t.statistics.source}: {dataset.metadata.source || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t.statistics.lastUpdated}: {dataset.metadata.lastUpdated || '—'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.statistics.methodology}: {dataset.metadata.methodology || '—'}
                  </p>
                </CardContent>
              </Card>

              <Card className="gov-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 p-4 border-b">
                    <Table2 className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">{t.statistics.table}</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {dataset.columns.map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.map((row, i) => (
                        <TableRow key={i}>
                          {dataset!.columns.map((col) => (
                            <TableCell key={col}>{row[col] ?? ''}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          <div className="mt-6">
            <Link to="/statistics" className="text-primary hover:underline">
              {t.common.back} to {t.nav.statistics}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StatisticsDepartmentPage;
