import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
  Building,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { toast } from 'sonner';

interface PortfolioAnalytics {
  portfolio_by_product: Array<{
    loan_product: string;
    loan_count: number;
    total_amount: number;
    disbursed_amount: number;
    avg_interest_rate: number;
  }>;
  monthly_trends: Array<{
    month: string;
    disbursement_count: number;
    total_disbursed: number;
  }>;
  collection_efficiency: number;
  collection_stats: {
    total_due: number;
    on_time_payments: number;
    overdue_payments: number;
  };
}

export default function Reports() {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics>({
    portfolio_by_product: [],
    monthly_trends: [],
    collection_efficiency: 0,
    collection_stats: { total_due: 0, on_time_payments: 0, overdue_payments: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [repaymentReport, setRepaymentReport] = useState<any>({ data: [], columns: [] });
  const [securityReport, setSecurityReport] = useState<any>({ data: [], columns: [] });
  const [interestReport, setInterestReport] = useState<any>({ data: [], columns: [] });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load all reports in parallel
      const [analyticsData, repaymentData, securityData, interestData] = await Promise.all([
        LoanService.getPortfolioAnalytics(),
        LoanService.getLoanRepaymentReport(),
        LoanService.getLoanSecurityStatusReport(),
        LoanService.getLoanInterestReport()
      ]);

      setAnalytics(analyticsData);
      setRepaymentReport(repaymentData);
      setSecurityReport(securityData);
      setInterestReport(interestData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
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

  const totalPortfolioValue = analytics.portfolio_by_product.reduce((sum, p) => sum + p.total_amount, 0);
  const totalDisbursed = analytics.portfolio_by_product.reduce((sum, p) => sum + p.disbursed_amount, 0);
  const avgInterestRate = analytics.portfolio_by_product.length > 0
    ? analytics.portfolio_by_product.reduce((sum, p) => sum + p.avg_interest_rate, 0) / analytics.portfolio_by_product.length
    : 0;

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Portfolio analytics and performance insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAnalytics} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="financial" className="gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-financial" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Disbursed</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(totalDisbursed)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Interest Rate</p>
                  <p className="text-2xl font-bold text-primary">{formatPercentage(avgInterestRate)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Collection Efficiency</p>
                  <p className="text-2xl font-bold text-success">{formatPercentage(analytics.collection_efficiency)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Repayment Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Loan Repayment Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {repaymentReport.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Repayment ID</th>
                      <th className="text-left p-2">Loan</th>
                      <th className="text-left p-2">Applicant</th>
                      <th className="text-right p-2">Principal</th>
                      <th className="text-right p-2">Interest</th>
                      <th className="text-right p-2">Paid Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repaymentReport.data.slice(0, 10).map((row: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2">{row.posting_date}</td>
                        <td className="p-2 font-mono text-xs">{row.loan_repayment}</td>
                        <td className="p-2 font-mono text-xs">{row.against_loan}</td>
                        <td className="p-2">{row.applicant}</td>
                        <td className="p-2 text-right">{formatCurrency(row.principal_amount || 0)}</td>
                        <td className="p-2 text-right">{formatCurrency(row.interest || 0)}</td>
                        <td className="p-2 text-right font-medium">{formatCurrency(row.paid_amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No repayment data available</p>
            )}
          </CardContent>
        </Card>

        {/* Loan Security Status Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Loan Security Status Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {securityReport.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Pledge ID</th>
                      <th className="text-left p-2">Loan</th>
                      <th className="text-left p-2">Applicant</th>
                      <th className="text-left p-2">Security</th>
                      <th className="text-right p-2">Quantity</th>
                      <th className="text-right p-2">Security Value</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityReport.data.slice(0, 10).map((row: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-xs">{row.loan_security_pledge}</td>
                        <td className="p-2 font-mono text-xs">{row.loan}</td>
                        <td className="p-2">{row.applicant}</td>
                        <td className="p-2">{row.loan_security}</td>
                        <td className="p-2 text-right">{row.qty}</td>
                        <td className="p-2 text-right">{formatCurrency(row.loan_security_value || 0)}</td>
                        <td className="p-2">
                          <Badge variant={row.status === 'Pledged' ? 'success' : 'secondary'}>
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No security data available</p>
            )}
          </CardContent>
        </Card>

        {/* Loan Interest Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Loan Interest Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interestReport.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Loan</th>
                      <th className="text-left p-2">Applicant</th>
                      <th className="text-right p-2">Sanctioned</th>
                      <th className="text-right p-2">Disbursed</th>
                      <th className="text-right p-2">Outstanding</th>
                      <th className="text-right p-2">Interest Rate</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interestReport.data.slice(0, 10).map((row: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-xs">{row.loan}</td>
                        <td className="p-2">{row.applicant_name}</td>
                        <td className="p-2 text-right">{formatCurrency(row.sanctioned_amount || 0)}</td>
                        <td className="p-2 text-right">{formatCurrency(row.disbursed_amount || 0)}</td>
                        <td className="p-2 text-right">{formatCurrency(row.total_outstanding || 0)}</td>
                        <td className="p-2 text-right">{row.rate_of_interest}%</td>
                        <td className="p-2">
                          <Badge variant={row.status === 'Sanctioned' ? 'success' : 'secondary'}>
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No interest data available</p>
            )}
          </CardContent>
        </Card>

        {/* Collection Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Collection Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium">On-time Payments</span>
                  </div>
                  <span className="font-bold text-success">{analytics.collection_stats.on_time_payments}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Overdue Payments</span>
                  </div>
                  <span className="font-bold text-destructive">{analytics.collection_stats.overdue_payments}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-medium">Total Due</span>
                  </div>
                  <span className="font-bold text-primary">{analytics.collection_stats.total_due}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Disbursement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.monthly_trends.slice(-6).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{trend.month}</div>
                      <div className="text-sm text-muted-foreground">{trend.disbursement_count} disbursements</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(trend.total_disbursed)}</div>
                    </div>
                  </div>
                ))}
                {analytics.monthly_trends.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No disbursement trends available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}