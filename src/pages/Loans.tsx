import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Loan } from '@/types/loan';
import { LoanService } from '@/services/loanService';

const mockLoans: Loan[] = [
  {
    name: 'LOAN-2024-001',
    applicant_type: 'Employee',
    applicant: 'EMP-001',
    applicant_name: 'John Doe',
    loan_product: 'Personal Loan',
    loan_amount: 25000,
    disbursed_amount: 25000,
    total_payment: 8500,
    outstanding_principal_amount: 16500,
    rate_of_interest: 8.5,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 24,
    status: 'Sanctioned',
    disbursement_date: '2024-01-20',
    repayment_start_date: '2024-02-20',
    is_secured_loan: false,
    creation: '2024-01-15T10:30:00',
    modified: '2024-01-20T14:20:00'
  },
  {
    name: 'LOAN-2024-002',
    applicant_type: 'Borrower',
    applicant: 'CUST-001',
    applicant_name: 'ABC Corporation',
    loan_product: 'Business Loan',
    loan_amount: 150000,
    disbursed_amount: 120000,
    total_payment: 45000,
    outstanding_principal_amount: 75000,
    rate_of_interest: 9.2,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 36,
    status: 'Partially Disbursed',
    disbursement_date: '2024-01-10',
    repayment_start_date: '2024-02-10',
    is_secured_loan: true,
    creation: '2024-01-05T09:15:00',
    modified: '2024-01-10T11:30:00'
  },
  {
    name: 'LOAN-2024-003',
    applicant_type: 'Employee',
    applicant: 'EMP-002',
    applicant_name: 'Sarah Wilson',
    loan_product: 'Auto Loan',
    loan_amount: 35000,
    disbursed_amount: 35000,
    total_payment: 12000,
    outstanding_principal_amount: 23000,
    rate_of_interest: 7.8,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 48,
    status: 'Fully Disbursed',
    disbursement_date: '2023-12-15',
    repayment_start_date: '2024-01-15',
    is_secured_loan: true,
    creation: '2023-12-10T11:45:00',
    modified: '2023-12-15T16:20:00'
  }
];

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = await LoanService.getLoans();
      setLoans(data);
    } catch (error) {
      console.error('Failed to load loans:', error);
      setLoans(mockLoans);
    } finally {
      setLoading(false);
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loan_product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Sanctioned': return 'approved';
      case 'Disbursed': return 'default';
      case 'Partially Disbursed': return 'pending';
      case 'Closed': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sanctioned': return CheckCircle;
      case 'Disbursed': return DollarSign;
      case 'Partially Disbursed': return Clock;
      case 'Closed': return CheckCircle;
      default: return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = (totalPayment: number, loanAmount: number) => {
    return Math.round((totalPayment / loanAmount) * 100);
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Loan Portfolio</h1>
            <p className="text-muted-foreground">Manage active loans and disbursements</p>
          </div>
          <Button variant="financial" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Loan
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-financial" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Portfolio</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(210000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(114500)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-approved" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Loans</p>
                  <p className="text-lg sm:text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-lg sm:text-2xl font-bold">0</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search loans..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Sanctioned">Sanctioned</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Partially Disbursed">Partially Disbursed</option>
                  <option value="Closed">Closed</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Loans ({filteredLoans.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Loan ID</TableHead>
                      <TableHead className="min-w-[180px]">Borrower</TableHead>
                      <TableHead className="min-w-[140px]">Product</TableHead>
                      <TableHead className="min-w-[120px]">Amount</TableHead>
                      <TableHead className="min-w-[120px]">Outstanding</TableHead>
                      <TableHead className="min-w-[100px]">Progress</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Next Payment</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.map((loan) => {
                      const StatusIcon = getStatusIcon(loan.status);
                      const progress = calculateProgress(loan.total_payment, loan.loan_amount);
                      return (
                        <TableRow key={loan.name} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{loan.name}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.applicant_name}</div>
                              <div className="text-sm text-muted-foreground">{loan.applicant_type}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.loan_product}</div>
                              <div className="text-sm text-muted-foreground">
                                {loan.rate_of_interest}% • {loan.repayment_periods}m
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(loan.loan_amount)}
                          </TableCell>
                          <TableCell className="font-medium text-warning">
                            {formatCurrency(loan.outstanding_principal_amount)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-financial h-2 rounded-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(loan.status)} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              <span className="hidden sm:inline">{loan.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {formatDate(loan.repayment_start_date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}