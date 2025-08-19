import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Building
} from 'lucide-react';

interface Report {
  name: string;
  title: string;
  description: string;
  category: 'Portfolio' | 'Collections' | 'Risk' | 'Performance' | 'Compliance';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'On-Demand';
  lastGenerated?: string;
  status: 'Available' | 'Generating' | 'Scheduled';
  icon: React.ComponentType<any>;
}

const availableReports: Report[] = [
  {
    name: 'portfolio-summary',
    title: 'Loan Portfolio Summary',
    description: 'Comprehensive overview of all active loans, disbursements, and outstanding amounts',
    category: 'Portfolio',
    frequency: 'Daily',
    lastGenerated: '2024-01-20T08:00:00',
    status: 'Available',
    icon: BarChart3
  },
  {
    name: 'repayment-schedule',
    title: 'Repayment Schedule Report',
    description: 'Upcoming payment schedules and expected cash flows',
    category: 'Collections',
    frequency: 'Weekly',
    lastGenerated: '2024-01-19T10:30:00',
    status: 'Available',
    icon: Calendar
  },
  {
    name: 'overdue-analysis',
    title: 'Overdue Loans Analysis',
    description: 'Detailed analysis of overdue loans and collection performance',
    category: 'Risk',
    frequency: 'Daily',
    lastGenerated: '2024-01-20T07:45:00',
    status: 'Available',
    icon: Clock
  },
  {
    name: 'disbursement-tracker',
    title: 'Disbursement Tracker',
    description: 'Track all loan disbursements and pending approvals',
    category: 'Portfolio',
    frequency: 'Daily',
    lastGenerated: '2024-01-20T08:15:00',
    status: 'Available',
    icon: DollarSign
  },
  {
    name: 'borrower-profile',
    title: 'Borrower Profile Report',
    description: 'Comprehensive borrower information and credit history',
    category: 'Risk',
    frequency: 'On-Demand',
    status: 'Available',
    icon: Users
  },
  {
    name: 'security-status',
    title: 'Security Coverage Report',
    description: 'Collateral status and coverage ratio analysis',
    category: 'Risk',
    frequency: 'Weekly',
    lastGenerated: '2024-01-18T14:20:00',
    status: 'Available',
    icon: CreditCard
  },
  {
    name: 'interest-accrual',
    title: 'Interest Accrual Report',
    description: 'Interest calculations and accrual tracking',
    category: 'Performance',
    frequency: 'Monthly',
    lastGenerated: '2024-01-01T00:00:00',
    status: 'Scheduled',
    icon: TrendingUp
  },
  {
    name: 'loan-aging',
    title: 'Loan Aging Analysis',
    description: 'Age-wise distribution of loans and maturity analysis',
    category: 'Portfolio',
    frequency: 'Monthly',
    lastGenerated: '2024-01-01T00:00:00',
    status: 'Available',
    icon: Activity
  },
  {
    name: 'compliance-audit',
    title: 'Compliance Audit Report',
    description: 'Regulatory compliance status and audit trail',
    category: 'Compliance',
    frequency: 'Quarterly',
    status: 'Generating',
    icon: Building
  },
  {
    name: 'portfolio-concentration',
    title: 'Portfolio Concentration Risk',
    description: 'Risk concentration by borrower, geography, and product',
    category: 'Risk',
    frequency: 'Monthly',
    lastGenerated: '2024-01-01T00:00:00',
    status: 'Available',
    icon: PieChart
  }
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('');

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || report.category === categoryFilter;
    const matchesFrequency = !frequencyFilter || report.frequency === frequencyFilter;
    return matchesSearch && matchesCategory && matchesFrequency;
  });

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Portfolio': return 'default';
      case 'Collections': return 'financial';
      case 'Risk': return 'warning';
      case 'Performance': return 'success';
      case 'Compliance': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'approved';
      case 'Generating': return 'pending';
      case 'Scheduled': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categories = ['Portfolio', 'Collections', 'Risk', 'Performance', 'Compliance'];
  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'On-Demand'];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and download lending reports</p>
          </div>
          <Button variant="financial" className="gap-2 w-full sm:w-auto">
            <FileText className="h-4 w-4" />
            Custom Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-financial" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-lg sm:text-2xl font-bold">{availableReports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-lg sm:text-2xl font-bold">{availableReports.filter(r => r.status === 'Available').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Generating</p>
                  <p className="text-lg sm:text-2xl font-bold">{availableReports.filter(r => r.status === 'Generating').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-lg sm:text-2xl font-bold">{availableReports.filter(r => r.status === 'Scheduled').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={frequencyFilter}
                  onChange={(e) => setFrequencyFilter(e.target.value)}
                >
                  <option value="">All Frequencies</option>
                  {frequencies.map(frequency => (
                    <option key={frequency} value={frequency}>{frequency}</option>
                  ))}
                </select>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getCategoryVariant(report.category)} className="text-xs">
                            {report.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.frequency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(report.status)} className="text-xs">
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                  
                  {report.lastGenerated && (
                    <div className="text-xs text-muted-foreground">
                      Last generated: {formatDate(report.lastGenerated)}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={report.status === 'Generating'}
                    >
                      {report.status === 'Generating' ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                    {report.status === 'Available' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}