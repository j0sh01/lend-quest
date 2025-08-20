import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Shield,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Home,
  Car,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Download,
  PieChart
} from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { PaginationWrapper } from '@/components/common/DataPagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SecurityCoverage {
  loan_id: string;
  applicant_name: string;
  loan_amount: number;
  disbursed_amount: number;
  total_security_value: number;
  coverage_ratio: number;
}

interface SecurityDistribution {
  loan_security_type: string;
  pledge_count: number;
  total_value: number;
}

interface SecurityValuationSummary {
  security_coverage: SecurityCoverage[];
  security_distribution: SecurityDistribution[];
  total_secured_loans: number;
}

export default function Securities() {
  const [securities, setSecurities] = useState<SecurityCoverage[]>([]);
  const [distribution, setDistribution] = useState<SecurityDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [summaryData, setSummaryData] = useState<SecurityValuationSummary>({
    security_coverage: [],
    security_distribution: [],
    total_secured_loans: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadSecurities();
  }, []);

  const loadSecurities = async () => {
    try {
      setLoading(true);
      const data = await LoanService.getSecurityValuationSummary();
      // Ensure data has proper structure
      const validatedSecurities = Array.isArray(data.security_coverage) ? data.security_coverage.map(security => ({
        ...security,
        loan_id: security.loan_id || '',
        applicant_name: security.applicant_name || '',
        loan_amount: security.loan_amount || 0,
        disbursed_amount: security.disbursed_amount || 0,
        total_security_value: security.total_security_value || 0,
        coverage_ratio: security.coverage_ratio || 0
      })) : [];

      setSecurities(validatedSecurities);
      setDistribution(data.security_distribution || []);
      setSummaryData(data);
    } catch (error) {
      console.error('Failed to load securities:', error);
      toast.error('Failed to load securities data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSecurities = securities.filter(security => {
    const matchesSearch = security.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         security.loan_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSecurities.length / pageSize);
  const paginatedSecurities = filteredSecurities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCoverageVariant = (ratio: number) => {
    if (ratio >= 120) return 'success' as const;
    if (ratio >= 100) return 'warning' as const;
    return 'destructive' as const;
  };

  const getCoverageIcon = (ratio: number) => {
    if (ratio >= 120) return CheckCircle;
    if (ratio >= 100) return AlertTriangle;
    return AlertTriangle;
  };

  const getSecurityTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'property': return Home;
      case 'vehicle': return Car;
      case 'equipment': return Briefcase;
      default: return Shield;
    }
  };

  const handleViewSecurity = (loanId: string) => {
    navigate(`/loans/${loanId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const totalSecurityValue = securities.reduce((sum, s) => sum + s.total_security_value, 0);
  const averageCoverage = securities.length > 0
    ? securities.reduce((sum, s) => sum + s.coverage_ratio, 0) / securities.length
    : 0;
  const underCoveredLoans = securities.filter(s => s.coverage_ratio < 100).length;

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 p-4 sm:p-0">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Securities Management</h1>
            <p className="text-muted-foreground">Monitor collateral and security coverage</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSecurities} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="financial"
              className="gap-2 w-full sm:w-auto"
              onClick={() => navigate('/securities/new')}
            >
              <Plus className="h-4 w-4" />
              Add Security
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Security Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSecurityValue)}</p>
                </div>
                <Shield className="h-8 w-8 text-financial" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Coverage</p>
                  <p className="text-2xl font-bold text-success">{formatPercentage(averageCoverage)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Secured Loans</p>
                  <p className="text-2xl font-bold text-primary">{summaryData.total_secured_loans}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Under-Covered</p>
                  <p className="text-2xl font-bold text-destructive">{underCoveredLoans}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by borrower name or loan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Distribution */}
        {distribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Security Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {distribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {React.createElement(getSecurityTypeIcon(item.loan_security_type), { className: "h-4 w-4" })}
                      <span className="font-medium">{item.loan_security_type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(item.total_value)}</div>
                      <div className="text-sm text-muted-foreground">{item.pledge_count} pledges</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Coverage Table */}
        <Card>
          <CardHeader>
            <CardTitle>Security Coverage ({filteredSecurities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">Loan ID</TableHead>
                    <TableHead className="min-w-[160px]">Borrower</TableHead>
                    <TableHead className="min-w-[120px]">Loan Amount</TableHead>
                    <TableHead className="min-w-[120px]">Disbursed</TableHead>
                    <TableHead className="min-w-[120px]">Security Value</TableHead>
                    <TableHead className="min-w-[100px]">Coverage Ratio</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSecurities.map((security, index) => {
                    const CoverageIcon = getCoverageIcon(security.coverage_ratio);
                    return (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium font-mono">{security.loan_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{security.applicant_name}</div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(security.loan_amount)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(security.disbursed_amount)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(security.total_security_value)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCoverageVariant(security.coverage_ratio)} className="gap-1">
                            <CoverageIcon className="h-3 w-3" />
                            {formatPercentage(security.coverage_ratio)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSecurity(security.loan_id)}
                              title="View Loan Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredSecurities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No security coverage data found
                </div>
              )}
            </div>
          </CardContent>

          {/* Pagination */}
          {!loading && paginatedSecurities.length > 0 && (
            <div className="px-6 pb-6">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredSecurities.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}