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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';

interface Disbursement {
  name: string;
  against_loan: string;
  loan_name: string;
  borrower_name: string;
  disbursement_date: string;
  disbursed_amount: number;
  bank_account: string;
  bank_name: string;
  reference_number?: string;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'Failed';
  mode_of_payment: string;
  posting_date: string;
  creation: string;
}

const mockDisbursements: Disbursement[] = [
  {
    name: 'DISB-2024-001',
    against_loan: 'LOAN-2024-001',
    loan_name: 'LOAN-2024-001',
    borrower_name: 'John Doe',
    disbursement_date: '2024-01-20',
    disbursed_amount: 25000,
    bank_account: '****1234',
    bank_name: 'Chase Bank',
    reference_number: 'TXN123456789',
    status: 'Disbursed',
    mode_of_payment: 'Bank Transfer',
    posting_date: '2024-01-20',
    creation: '2024-01-20T10:30:00'
  },
  {
    name: 'DISB-2024-002',
    against_loan: 'LOAN-2024-002',
    loan_name: 'LOAN-2024-002',
    borrower_name: 'ABC Corporation',
    disbursement_date: '2024-01-22',
    disbursed_amount: 75000,
    bank_account: '****5678',
    bank_name: 'Bank of America',
    status: 'Approved',
    mode_of_payment: 'Bank Transfer',
    posting_date: '2024-01-22',
    creation: '2024-01-21T14:15:00'
  },
  {
    name: 'DISB-2024-003',
    against_loan: 'LOAN-2024-002',
    loan_name: 'LOAN-2024-002',
    borrower_name: 'ABC Corporation',
    disbursement_date: '2024-01-25',
    disbursed_amount: 45000,
    bank_account: '****5678',
    bank_name: 'Bank of America',
    status: 'Pending',
    mode_of_payment: 'Bank Transfer',
    posting_date: '2024-01-25',
    creation: '2024-01-24T09:20:00'
  },
  {
    name: 'DISB-2024-004',
    against_loan: 'LOAN-2024-003',
    loan_name: 'LOAN-2024-003',
    borrower_name: 'Sarah Wilson',
    disbursement_date: '2023-12-15',
    disbursed_amount: 35000,
    bank_account: '****9012',
    bank_name: 'Wells Fargo',
    reference_number: 'TXN987654321',
    status: 'Disbursed',
    mode_of_payment: 'Bank Transfer',
    posting_date: '2023-12-15',
    creation: '2023-12-15T11:45:00'
  }
];

export default function Disbursements() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadDisbursements();
  }, []);

  const loadDisbursements = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDisbursements(mockDisbursements);
    } catch (error) {
      console.error('Failed to load disbursements:', error);
      setDisbursements(mockDisbursements);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisbursements = disbursements.filter(disbursement => {
    const matchesSearch = disbursement.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disbursement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disbursement.loan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || disbursement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Approved': return 'approved';
      case 'Disbursed': return 'default';
      case 'Failed': return 'rejected';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return Clock;
      case 'Approved': return CheckCircle;
      case 'Disbursed': return DollarSign;
      case 'Failed': return XCircle;
      default: return AlertCircle;
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

  const totalDisbursed = disbursements
    .filter(d => d.status === 'Disbursed')
    .reduce((sum, d) => sum + d.disbursed_amount, 0);

  const pendingAmount = disbursements
    .filter(d => d.status === 'Pending' || d.status === 'Approved')
    .reduce((sum, d) => sum + d.disbursed_amount, 0);

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Disbursements</h1>
            <p className="text-muted-foreground">Process and track loan disbursements</p>
          </div>
          <Button variant="financial" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Disbursement
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-financial" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Disbursed</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(totalDisbursed)}</p>
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
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-lg sm:text-2xl font-bold">{disbursements.filter(d => d.status === 'Disbursed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-lg sm:text-2xl font-bold">{disbursements.filter(d => 
                    new Date(d.creation).getMonth() === new Date().getMonth()
                  ).length}</p>
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
                  placeholder="Search disbursements..."
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
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Failed">Failed</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disbursements Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Disbursements ({filteredDisbursements.length})</span>
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
                      <TableHead className="min-w-[140px]">Disbursement ID</TableHead>
                      <TableHead className="min-w-[140px]">Loan ID</TableHead>
                      <TableHead className="min-w-[180px]">Borrower</TableHead>
                      <TableHead className="min-w-[120px]">Amount</TableHead>
                      <TableHead className="min-w-[180px]">Bank Details</TableHead>
                      <TableHead className="min-w-[140px]">Reference</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisbursements.map((disbursement) => {
                      const StatusIcon = getStatusIcon(disbursement.status);
                      return (
                        <TableRow key={disbursement.name} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{disbursement.name}</TableCell>
                          <TableCell className="font-mono text-sm">{disbursement.loan_name}</TableCell>
                          <TableCell>
                            <div className="font-medium">{disbursement.borrower_name}</div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(disbursement.disbursed_amount)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{disbursement.bank_name}</div>
                              <div className="text-sm text-muted-foreground">{disbursement.bank_account}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {disbursement.reference_number ? (
                              <div className="font-mono text-sm">{disbursement.reference_number}</div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(disbursement.status)} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              <span className="hidden sm:inline">{disbursement.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(disbursement.disbursement_date)}
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