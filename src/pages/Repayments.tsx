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
  Clock,
  Download
} from 'lucide-react';

interface Repayment {
  name: string;
  against_loan: string;
  loan_name: string;
  borrower_name: string;
  posting_date: string;
  amount_paid: number;
  principal_amount_paid: number;
  interest_amount_paid: number;
  penalty_amount_paid: number;
  mode_of_payment: string;
  reference_number?: string;
  repayment_type: 'Normal Repayment' | 'Prepayment' | 'Charges Waiver';
  status: 'Submitted' | 'Approved' | 'Rejected';
  creation: string;
}

const mockRepayments: Repayment[] = [
  {
    name: 'REP-2024-001',
    against_loan: 'LOAN-2024-001',
    loan_name: 'LOAN-2024-001',
    borrower_name: 'John Doe',
    posting_date: '2024-02-20',
    amount_paid: 1500,
    principal_amount_paid: 900,
    interest_amount_paid: 600,
    penalty_amount_paid: 0,
    mode_of_payment: 'Bank Transfer',
    reference_number: 'PAY123456789',
    repayment_type: 'Normal Repayment',
    status: 'Approved',
    creation: '2024-02-20T10:30:00'
  },
  {
    name: 'REP-2024-002',
    against_loan: 'LOAN-2024-001',
    loan_name: 'LOAN-2024-001',
    borrower_name: 'John Doe',
    posting_date: '2024-03-20',
    amount_paid: 1500,
    principal_amount_paid: 920,
    interest_amount_paid: 580,
    penalty_amount_paid: 0,
    mode_of_payment: 'Cash',
    repayment_type: 'Normal Repayment',
    status: 'Submitted',
    creation: '2024-03-20T14:15:00'
  },
  {
    name: 'REP-2024-003',
    against_loan: 'LOAN-2024-002',
    loan_name: 'LOAN-2024-002',
    borrower_name: 'ABC Corporation',
    posting_date: '2024-02-10',
    amount_paid: 5000,
    principal_amount_paid: 3200,
    interest_amount_paid: 1800,
    penalty_amount_paid: 0,
    mode_of_payment: 'Bank Transfer',
    reference_number: 'PAY987654321',
    repayment_type: 'Normal Repayment',
    status: 'Approved',
    creation: '2024-02-10T09:20:00'
  },
  {
    name: 'REP-2024-004',
    against_loan: 'LOAN-2024-003',
    loan_name: 'LOAN-2024-003',
    borrower_name: 'Sarah Wilson',
    posting_date: '2024-01-15',
    amount_paid: 800,
    principal_amount_paid: 600,
    interest_amount_paid: 200,
    penalty_amount_paid: 0,
    mode_of_payment: 'Bank Transfer',
    reference_number: 'PAY456789123',
    repayment_type: 'Normal Repayment',
    status: 'Approved',
    creation: '2024-01-15T16:45:00'
  },
  {
    name: 'REP-2024-005',
    against_loan: 'LOAN-2024-001',
    loan_name: 'LOAN-2024-001',
    borrower_name: 'John Doe',
    posting_date: '2024-04-01',
    amount_paid: 5000,
    principal_amount_paid: 5000,
    interest_amount_paid: 0,
    penalty_amount_paid: 0,
    mode_of_payment: 'Bank Transfer',
    reference_number: 'PAY111222333',
    repayment_type: 'Prepayment',
    status: 'Submitted',
    creation: '2024-04-01T11:30:00'
  }
];

export default function Repayments() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    loadRepayments();
  }, []);

  const loadRepayments = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRepayments(mockRepayments);
    } catch (error) {
      console.error('Failed to load repayments:', error);
      setRepayments(mockRepayments);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepayments = repayments.filter(repayment => {
    const matchesSearch = repayment.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repayment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repayment.loan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || repayment.status === statusFilter;
    const matchesType = !typeFilter || repayment.repayment_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Submitted': return 'pending';
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      default: return 'default';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'Normal Repayment': return 'default';
      case 'Prepayment': return 'success';
      case 'Charges Waiver': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return Clock;
      case 'Approved': return CheckCircle;
      case 'Rejected': return AlertTriangle;
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

  const totalCollected = repayments
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.amount_paid, 0);

  const pendingAmount = repayments
    .filter(r => r.status === 'Submitted')
    .reduce((sum, r) => sum + r.amount_paid, 0);

  const thisMonthCollection = repayments
    .filter(r => r.status === 'Approved' && new Date(r.posting_date).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + r.amount_paid, 0);

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Repayments</h1>
            <p className="text-muted-foreground">Track and process loan repayments</p>
          </div>
          <Button variant="financial" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-financial" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Collected</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(totalCollected)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(pendingAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(thisMonthCollection)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Transactions</p>
                  <p className="text-lg sm:text-2xl font-bold">{repayments.length}</p>
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
                  placeholder="Search repayments..."
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
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Normal Repayment">Normal</option>
                  <option value="Prepayment">Prepayment</option>
                  <option value="Charges Waiver">Waiver</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repayments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Repayments ({filteredRepayments.length})</span>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
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
                      <TableHead className="min-w-[140px]">Repayment ID</TableHead>
                      <TableHead className="min-w-[140px]">Loan ID</TableHead>
                      <TableHead className="min-w-[160px]">Borrower</TableHead>
                      <TableHead className="min-w-[120px]">Amount</TableHead>
                      <TableHead className="min-w-[140px]">Breakdown</TableHead>
                      <TableHead className="min-w-[120px]">Payment Mode</TableHead>
                      <TableHead className="min-w-[140px]">Reference</TableHead>
                      <TableHead className="min-w-[120px]">Type</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRepayments.map((repayment) => {
                      const StatusIcon = getStatusIcon(repayment.status);
                      return (
                        <TableRow key={repayment.name} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{repayment.name}</TableCell>
                          <TableCell className="font-mono text-sm">{repayment.loan_name}</TableCell>
                          <TableCell>
                            <div className="font-medium">{repayment.borrower_name}</div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(repayment.amount_paid)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div>P: {formatCurrency(repayment.principal_amount_paid)}</div>
                              <div>I: {formatCurrency(repayment.interest_amount_paid)}</div>
                              {repayment.penalty_amount_paid > 0 && (
                                <div>F: {formatCurrency(repayment.penalty_amount_paid)}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{repayment.mode_of_payment}</div>
                          </TableCell>
                          <TableCell>
                            {repayment.reference_number ? (
                              <div className="font-mono text-sm">{repayment.reference_number}</div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeVariant(repayment.repayment_type)} className="text-xs">
                              {repayment.repayment_type === 'Normal Repayment' ? 'Normal' : 
                               repayment.repayment_type === 'Prepayment' ? 'Prepay' : 'Waiver'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(repayment.status)} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              <span className="hidden sm:inline">{repayment.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(repayment.posting_date)}
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