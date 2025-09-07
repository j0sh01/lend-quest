import { useState, useEffect } from 'react';
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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { LoanDisbursement, DisbursementsSummaryResponse } from '@/types/loan';
import { DisbursementViewModal } from '@/components/modals/DisbursementViewModal';
import { useNavigate } from 'react-router-dom';
import { PaginationWrapper } from '@/components/common/DataPagination';
import { toast } from 'sonner';

// Extended disbursement type that includes additional fields from the API
interface ExtendedDisbursement extends LoanDisbursement {
  applicant_name?: string;
  docstatus?: number;
  loan_product?: string;
  applicant_type?: string;
}

export default function Disbursements() {
  const [disbursements, setDisbursements] = useState<ExtendedDisbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<DisbursementsSummaryResponse>({
    disbursements: [],
    total_count: 0,
    pending_count: 0,
    pending_amount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDisbursements();
  }, []);

  const loadDisbursements = async () => {
    try {
      setLoading(true);
      const data = await LoanService.getDisbursementsSummary() as DisbursementsSummaryResponse;
      // Ensure data has proper structure
      const validatedDisbursements = Array.isArray(data.disbursements) ? data.disbursements.map((disbursement: any): ExtendedDisbursement => ({
        ...disbursement,
        name: disbursement.name || '',
        against_loan: disbursement.against_loan || '',
        applicant_name: disbursement.applicant_name || '',
        disbursement_date: disbursement.disbursement_date || '',
        disbursed_amount: disbursement.disbursed_amount || 0,
        docstatus: disbursement.docstatus || 0,
        creation: disbursement.creation || new Date().toISOString(),
        loan_product: disbursement.loan_product || '',
        applicant_type: disbursement.applicant_type || '',
        bank_account: disbursement.bank_account || '',
        reference_number: disbursement.reference_number || '',
        status: disbursement.status || 'Draft'
      })) : [];

      setDisbursements(validatedDisbursements);
      setSummaryData(data);
    } catch (error) {
      console.error('Failed to load disbursements:', error);
      toast.error('Failed to load disbursements');
    } finally {
      setLoading(false);
    }
  };

  const filteredDisbursements = disbursements.filter(disbursement => {
    const matchesSearch = disbursement.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disbursement.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disbursement.against_loan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || getStatusFromDocstatus(disbursement.docstatus) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDisbursements.length / pageSize);
  const paginatedDisbursements = filteredDisbursements.slice(
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
      case 2: return XCircle;
      default: return AlertCircle;
    }
  };

  const handleViewDisbursement = (disbursement: any) => {
    setSelectedDisbursement(disbursement);
    setShowViewModal(true);
  };

  const handleEditDisbursement = (disbursement: any) => {
    // For now, just show view modal - can be extended later
    setSelectedDisbursement(disbursement);
    setShowViewModal(true);
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

  const totalDisbursed = disbursements
    .filter(d => d.docstatus === 1)
    .reduce((sum, d) => sum + d.disbursed_amount, 0);

  const pendingAmount = summaryData.pending_amount;

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Disbursements</h1>
            <p className="text-muted-foreground">Process and track loan disbursements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadDisbursements} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="financial"
              className="gap-2 w-full sm:w-auto"
              onClick={() => navigate('/disbursements/new')}
            >
              <Plus className="h-4 w-4" />
              New Disbursement
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Disbursed</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalDisbursed)}</p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{disbursements.filter(d => d.docstatus === 1).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Count</p>
                  <p className="text-2xl font-bold text-primary">{summaryData.total_count}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
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
                  placeholder="Search disbursements by borrower, loan ID, or disbursement ID..."
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

        {/* Disbursements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Disbursements ({filteredDisbursements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">Disbursement ID</TableHead>
                    <TableHead className="min-w-[140px]">Loan ID</TableHead>
                    <TableHead className="min-w-[180px]">Borrower</TableHead>
                    <TableHead className="min-w-[120px]">Amount</TableHead>
                    <TableHead className="min-w-[120px]">Product</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDisbursements.map((disbursement) => {
                    const StatusIcon = getStatusIcon(disbursement.docstatus);
                    return (
                      <TableRow key={disbursement.name} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium font-mono">{disbursement.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(disbursement.creation)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium font-mono">{disbursement.against_loan}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{disbursement.applicant_name}</div>
                          <div className="text-sm text-muted-foreground">{disbursement.applicant_type}</div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(disbursement.disbursed_amount)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{disbursement.loan_product}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(disbursement.docstatus)} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {getStatusFromDocstatus(disbursement.docstatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(disbursement.disbursement_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDisbursement(disbursement)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDisbursement(disbursement)}
                              title="Edit Disbursement"
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

              {filteredDisbursements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No disbursements found matching your criteria
                </div>
              )}
            </div>
          </CardContent>

          {/* Pagination */}
          {!loading && paginatedDisbursements.length > 0 && (
            <div className="px-6 pb-6">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredDisbursements.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Disbursement View Modal */}
      <DisbursementViewModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        disbursement={selectedDisbursement}
        onEdit={handleEditDisbursement}
      />
    </Layout>
  );
}