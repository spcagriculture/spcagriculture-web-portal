import React, { useMemo, useState } from 'react';
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

const departmentLabels: Record<string, string> = {
  agriculture: 'Agriculture',
  land: 'Land Commissioner',
  animal: 'Animal Production & Health',
  fisheries: 'Fisheries',
  irrigation: 'Irrigation',
};

const mockDataset = {
  columns: ['Year', 'District', 'Metric', 'Value'],
  rows: [
    { Year: '2023', District: 'Ratnapura', Metric: 'Paddy (MT)', Value: '125,000' },
    { Year: '2023', District: 'Kegalle', Metric: 'Paddy (MT)', Value: '98,000' },
    { Year: '2023', District: 'Ratnapura', Metric: 'Tea (kg)', Value: '45,200' },
    { Year: '2023', District: 'Kegalle', Metric: 'Tea (kg)', Value: '52,100' },
    { Year: '2022', District: 'Ratnapura', Metric: 'Paddy (MT)', Value: '118,000' },
    { Year: '2022', District: 'Kegalle', Metric: 'Paddy (MT)', Value: '92,000' },
  ],
  metadata: { source: 'Department of Agriculture, Sabaragamuwa', lastUpdated: '2024-01-10', methodology: 'Annual survey and administrative data.' },
};

const StatisticsDepartmentPage: React.FC = () => {
  const { t } = useLanguage();
  const { department } = useParams<{ department: string }>();
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  const deptName = department ? (t.departments[department as keyof typeof t.departments] ?? departmentLabels[department] ?? department) : '';

  const filteredRows = useMemo(() => {
    let rows = [...mockDataset.rows];
    if (yearFilter !== 'all') rows = rows.filter((r) => r.Year === yearFilter);
    if (districtFilter !== 'all') rows = rows.filter((r) => r.District === districtFilter);
    return rows;
  }, [yearFilter, districtFilter]);

  const years = useMemo(() => [...new Set(mockDataset.rows.map((r) => r.Year))], []);
  const districts = useMemo(() => [...new Set(mockDataset.rows.map((r) => r.District))], []);

  if (!department) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Department not specified.</p>
            <Link to="/statistics" className="text-primary hover:underline">{t.common.back} to Statistics</Link>
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
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t.statistics.download}
            </Button>
          </div>

          <Card className="gov-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <FileText className="h-4 w-4" />
                <span>{t.statistics.source}: {mockDataset.metadata.source}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Calendar className="h-4 w-4" />
                <span>{t.statistics.lastUpdated}: {mockDataset.metadata.lastUpdated}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.statistics.methodology}: {mockDataset.metadata.methodology}</p>
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
                    {mockDataset.columns.map((col) => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Year}</TableCell>
                      <TableCell>{row.District}</TableCell>
                      <TableCell>{row.Metric}</TableCell>
                      <TableCell>{row.Value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Link to="/statistics" className="text-primary hover:underline">{t.common.back} to {t.nav.statistics}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StatisticsDepartmentPage;
