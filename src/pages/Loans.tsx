import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoanDetail } from '@/components/details/LoanDetail';
import { LoanModal } from '@/components/modals/LoanModal';
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
import { PaginationWrapper } from '@/components/common/DataPagination';

const mockLoans: Loan[] = [
  {
    name: 'LOAN-2024-001',
    loan_application: 'LA-2024-001',
    applicant_type: 'Employee',
    applicant: 'EMP-001',
    applicant_name: 'John Doe',
    loan_product: 'Personal Loan',
    loan_amount: 25000,
    disbursed_amount: 25000,
    total_payment: 8500,
    total_principal_paid: 8500,
    total_interest_payable: 2000,
    written_off_amount: 0,
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
    loan_application: 'LA-2024-002',
    applicant_type: 'Borrower',
    applicant: 'CUST-001',
    applicant_name: 'ABC Corporation',
    loan_product: 'Business Loan',
    loan_amount: 150000,
    disbursed_amount: 120000,
    total_payment: 45000,
    total_principal_paid: 45000,
    total_interest_payable: 15000,
    written_off_amount: 0,
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
    loan_application: 'LA-2024-003',
    applicant_type: 'Employee',
    applicant: 'EMP-002',
    applicant_name: 'Sarah Wilson',
    loan_product: 'Auto Loan',
    loan_amount: 35000,
    disbursed_amount: 35000,
    total_payment: 12000,
    total_principal_paid: 12000,
    total_interest_payable: 8000,
    written_off_amount: 0,
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // If there's an ID, show the detail view
  if (id) {
    return <LoanDetail />;
  }
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [showLoanModal, setShowLoanModal] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      // Try both methods to see which one works
      let data;
      try {
        const response = await LoanService.getLoansSummary();
        data = response.loans;
        setTotalCount(response.total_count || data.length);
      } catch (summaryError) {
        console.log('Summary API failed, trying regular API:', summaryError);
        data = await LoanService.getLoans();
        setTotalCount(data.length);
      }
      // Ensure data is an array and has proper structure
      const validatedData = Array.isArray(data) ? data.map(loan => ({
        ...loan,
        name: loan.name || '',
        applicant: loan.applicant || '',
        applicant_name: loan.applicant_name || '',
        applicant_type: (loan.applicant_type === 'Employee' || loan.applicant_type === 'Borrower')
          ? loan.applicant_type
          : 'Employee' as const,
        loan_product: loan.loan_product || '',
        loan_amount: loan.loan_amount || 0,
        disbursed_amount: loan.disbursed_amount || 0,
        total_payment: loan.total_payment || 0,
        total_principal_paid: loan.total_principal_paid || 0,
        outstanding_principal_amount: loan.outstanding_principal_amount || (loan.loan_amount - (loan.total_principal_paid || 0)),
        rate_of_interest: loan.rate_of_interest || 0,
        repayment_periods: loan.repayment_periods || 12,
        repayment_schedule_type: loan.repayment_schedule_type || 'Monthly',
        repayment_start_date: loan.repayment_start_date || '',
        status: (['Sanctioned', 'Partially Disbursed', 'Fully Disbursed', 'Closed', 'Loan Closure Requested'].includes(loan.status))
          ? loan.status as 'Sanctioned' | 'Partially Disbursed' | 'Fully Disbursed' | 'Closed' | 'Loan Closure Requested'
          : 'Sanctioned' as const,
        creation: loan.creation || new Date().toISOString()
      })) : [];
      setLoans(validatedData);
    } catch (error) {
      console.error('Failed to load loans:', error);
      setLoans(mockLoans);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLoan = (loanId: string) => {
    // Navigate to loan details page or open modal
    navigate(`/loans/${loanId}`);
  };

  const handleEditLoan = (loanId: string) => {
    // Navigate to loan edit page
    navigate(`/loans/${loanId}/edit`);
  };

  const handleDisburseLoan = (loanId: string) => {
    // Navigate to disbursement page with pre-filled loan
    navigate(`/disbursements?loan=${loanId}`);
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loan_product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.applicant?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLoans.length / pageSize);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateProgress = (totalPayment: number, loanAmount: number) => {
    if (!loanAmount || loanAmount === 0) return 0;
    return Math.round(((totalPayment || 0) / loanAmount) * 100);
  };

  const calculateNextPaymentDate = (repaymentStartDate: string | undefined, repaymentScheduleType: string) => {
    if (!repaymentStartDate) return null;

    try {
      const startDate = new Date(repaymentStartDate);
      if (isNaN(startDate.getTime())) return null;

      const nextDate = new Date(startDate);
      const today = new Date();

      // Calculate next payment based on schedule type
      while (nextDate <= today) {
        switch (repaymentScheduleType) {
          case 'Weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'Monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'Quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
          default:
            nextDate.setMonth(nextDate.getMonth() + 1);
        }
      }

      return nextDate;
    } catch (error) {
      return null;
    }
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
          <Button
            variant="financial"
            className="gap-2 w-full sm:w-auto"
            onClick={() => setShowLoanModal(true)}
          >
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
                    {paginatedLoans.map((loan) => {
                      const StatusIcon = getStatusIcon(loan.status);
                      const progress = calculateProgress(loan.total_payment, loan.loan_amount);
                      return (
                        <TableRow key={loan.name} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{loan.name}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.applicant_name}</div>
                              <div className="text-sm text-muted-foreground">{loan.applicant_type}</div>
                              <div className="text-xs text-muted-foreground font-mono">{loan.applicant}</div>
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
                            {formatCurrency(loan.outstanding_principal_amount || 0)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-financial h-2 rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
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
                              {(() => {
                                const nextPayment = calculateNextPaymentDate(loan.repayment_start_date, loan.repayment_schedule_type || 'Monthly');
                                return nextPayment ? formatDate(nextPayment.toISOString()) : formatDate(loan.repayment_start_date);
                              })()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewLoan(loan.name)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDisburseLoan(loan.name)}
                                title="Disburse"
                              >
                                <DollarSign className="h-4 w-4" />
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

          {/* Pagination */}
          {!loading && paginatedLoans.length > 0 && (
            <div className="px-6 pb-6">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredLoans.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Loan Modal */}
      <LoanModal
        open={showLoanModal}
        onOpenChange={setShowLoanModal}
        onSuccess={() => {
          loadLoans();
          setShowLoanModal(false);
        }}
      />
    </Layout>
  );
}