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
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  CreditCard
} from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { LoanRepayment, RepaymentsSummaryResponse } from '@/types/loan';
import { PaginationWrapper } from '@/components/common/DataPagination';
import { RepaymentModal } from '@/components/modals/RepaymentModal';
import { RepaymentViewModal } from '@/components/modals/RepaymentViewModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Repayments() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [summaryData, setSummaryData] = useState<RepaymentsSummaryResponse>({
    repayments: [],
    total_count: 0,
    overdue_count: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRepayments();
  }, []);

  const loadRepayments = async () => {
    try {
      setLoading(true);
      const data = await LoanService.getRepaymentsSummary() as any;

      // Ensure data has proper structure
      const validatedRepayments = Array.isArray(data.repayments) ? data.repayments.map((repayment: any) => ({
        ...repayment,
        name: repayment.name || '',
        against_loan: repayment.against_loan || '',
        applicant_name: repayment.applicant_name || '',
        posting_date: repayment.posting_date || '',
        amount_paid: repayment.amount_paid || 0,
        docstatus: repayment.docstatus || 0,
        repayment_type: repayment.repayment_type || 'Normal Repayment',
        creation: repayment.creation || new Date().toISOString(),
        loan_product: repayment.loan_product || ''
      })) : [];

      setRepayments(validatedRepayments);
      setSummaryData(data);
    } catch (error) {
      console.error('Failed to load repayments:', error);
      toast.error('Failed to load repayments');
    } finally {
      setLoading(false);
    }
  };

  const filteredRepayments = repayments.filter(repayment => {
    const matchesSearch = repayment.applicant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repayment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repayment.against_loan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || getStatusFromDocstatus(repayment.docstatus) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRepayments.length / pageSize);
  const paginatedRepayments = filteredRepayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusFromDocstatus = (docstatus: number) => {
    switch (docstatus) {
      case 0: return 'Draft';
      case 1: return 'Submitted';
      case 2: return 'Cancelled';
      default: return 'Draft';
    }
  };

  const getStatusVariant = (docstatus: number) => {
    switch (docstatus) {
      case 1: return 'success' as const;
      case 0: return 'warning' as const;
      case 2: return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  const getStatusIcon = (docstatus: number) => {
    switch (docstatus) {
      case 1: return CheckCircle;
      case 0: return Clock;
      case 2: return AlertTriangle;
      default: return Clock;
    }
  };

  const getRepaymentTypeVariant = (type: string) => {
    switch (type) {
      case 'Normal Repayment': return 'default' as const;
      case 'Prepayment': return 'success' as const;
      case 'Charges Waiver': return 'warning' as const;
      default: return 'secondary' as const;
    }
  };

  const handleViewRepayment = (repayment: any) => {
    setSelectedRepayment(repayment);
    setShowViewModal(true);
  };

  const handleEditRepayment = (repayment: any) => {
    setSelectedRepayment(repayment);
    setShowRepaymentModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
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

  const totalRepayments = repayments.reduce((sum, r) => sum + r.amount_paid, 0);
  const thisMonthRepayments = repayments.filter(r =>
    new Date(r.creation).getMonth() === new Date().getMonth()
  ).length;

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

  const totalCollected = repayments
    .filter(r => r.docstatus === 1)
    .reduce((sum, r) => sum + r.amount_paid, 0);

  const pendingAmount = repayments
    .filter(r => r.docstatus === 0)
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadRepayments} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="financial"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setShowRepaymentModal(true)}
            >
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCollected)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-financial" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(pendingAmount)}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-success">{thisMonthRepayments}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">{summaryData.overdue_count}</p>
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
                  placeholder="Search repayments by borrower, loan ID, or repayment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repayments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Repayments ({filteredRepayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">Repayment ID</TableHead>
                    <TableHead className="min-w-[140px]">Loan ID</TableHead>
                    <TableHead className="min-w-[160px]">Borrower</TableHead>
                    <TableHead className="min-w-[120px]">Amount</TableHead>
                    <TableHead className="min-w-[120px]">Product</TableHead>
                    <TableHead className="min-w-[120px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRepayments.map((repayment) => {
                    const StatusIcon = getStatusIcon(repayment.docstatus);
                    return (
                      <TableRow key={repayment.name} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium font-mono">{repayment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(repayment.creation)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium font-mono">{repayment.against_loan}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{repayment.applicant}</div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(repayment.amount_paid)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{repayment.loan_product}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRepaymentTypeVariant(repayment.repayment_type)} className="text-xs">
                            {repayment.repayment_type === 'Normal Repayment' ? 'Normal' :
                             repayment.repayment_type === 'Prepayment' ? 'Prepay' : 'Waiver'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(repayment.docstatus)} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {getStatusFromDocstatus(repayment.docstatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(repayment.posting_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRepayment(repayment)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRepayment(repayment)}
                              title="Edit Repayment"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredRepayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No repayments found matching your criteria
                </div>
              )}
            </div>
          </CardContent>

          {/* Pagination */}
          {!loading && paginatedRepayments.length > 0 && (
            <div className="px-6 pb-6">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredRepayments.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Repayment Modal */}
      <RepaymentModal
        open={showRepaymentModal}
        onOpenChange={(open) => {
          setShowRepaymentModal(open);
          if (!open) setSelectedRepayment(null);
        }}
        onSuccess={() => {
          loadRepayments();
          setShowRepaymentModal(false);
          setSelectedRepayment(null);
        }}
        editData={selectedRepayment}
      />

      {/* Repayment View Modal */}
      <RepaymentViewModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        repayment={selectedRepayment}
        onEdit={handleEditRepayment}
      />
    </Layout>
  );
}