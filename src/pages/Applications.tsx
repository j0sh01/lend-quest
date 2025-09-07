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
  Edit, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { LoanApplication } from '@/types/loan';
import { LoanService } from '@/services/loanService';
import { LoanApplicationModal } from '@/components/modals/LoanApplicationModal';
import { LoanApplicationViewModal } from '@/components/modals/LoanApplicationViewModal';
import { PaginationWrapper } from '@/components/common/DataPagination';

const mockApplications: LoanApplication[] = [
  {
    name: 'LA-2024-001',
    applicant_type: 'Employee',
    applicant: 'EMP-001',
    applicant_name: 'John Doe',
    loan_product: 'Personal Loan',
    loan_amount: 25000,
    rate_of_interest: 8.5,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 24,
    is_secured_loan: false,
    status: 'Submitted',
    creation: '2024-01-15T10:30:00',
    modified: '2024-01-15T10:30:00'
  },
  {
    name: 'LA-2024-002',
    applicant_type: 'Borrower',
    applicant: 'CUST-001',
    applicant_name: 'ABC Corporation',
    loan_product: 'Business Loan',
    loan_amount: 150000,
    rate_of_interest: 9.2,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 36,
    is_secured_loan: true,
    status: 'Approved',
    creation: '2024-01-14T14:20:00',
    modified: '2024-01-16T09:15:00'
  },
  {
    name: 'LA-2024-003',
    applicant_type: 'Employee',
    applicant: 'EMP-002',
    applicant_name: 'Sarah Wilson',
    loan_product: 'Auto Loan',
    loan_amount: 35000,
    rate_of_interest: 7.8,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 48,
    is_secured_loan: true,
    status: 'Draft',
    creation: '2024-01-16T11:45:00',
    modified: '2024-01-16T11:45:00'
  },
  {
    name: 'LA-2024-004',
    applicant_type: 'Borrower',
    applicant: 'CUST-002',
    applicant_name: 'Mike Johnson',
    loan_product: 'Home Loan',
    loan_amount: 300000,
    rate_of_interest: 6.5,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 240,
    is_secured_loan: true,
    status: 'Rejected',
    creation: '2024-01-12T16:20:00',
    modified: '2024-01-13T10:30:00'
  }
];

export default function Applications() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await LoanService.getLoanApplicationsSummary();
      const data = response.applications;
      // Ensure data is an array and has proper structure
      const validatedData = Array.isArray(data) ? data.map(app => ({
        ...app,
        name: app.name || '',
        applicant: app.applicant || '',
        applicant_name: app.applicant_name || '',
        applicant_type: app.applicant_type || 'Employee',
        loan_product: app.loan_product || '',
        loan_amount: app.loan_amount || 0,
        rate_of_interest: app.rate_of_interest || 0,
        repayment_periods: app.repayment_periods || 0,
        repayment_schedule_type: app.repayment_schedule_type || 'Monthly',
        status: app.status || 'Draft',
        creation: app.creation || new Date().toISOString()
      })) : [];
      setApplications(validatedData);
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Use mock data for development
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.loan_product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Submitted': return 'pending';
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return CheckCircle;
      case 'Rejected': return XCircle;
      case 'Submitted': return Clock;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  const handleEditApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loan Applications</h1>
            <p className="text-muted-foreground">Manage and review loan applications</p>
          </div>
          <Button variant="financial" className="gap-2" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Applications ({filteredApplications.length})</span>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Loan Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplications.map((application) => {
                    const StatusIcon = getStatusIcon(application.status);
                    return (
                      <TableRow key={application.name} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{application.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm text-muted-foreground">{application.applicant_type || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground font-mono">{application.applicant || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.loan_product || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {application.repayment_periods || 0} {application.repayment_schedule_type?.toLowerCase() || 'monthly'} payments
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(application.loan_amount || 0)}
                        </TableCell>
                        <TableCell>{application.rate_of_interest || 0}%</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(application.status)} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(application.creation)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewApplication(application)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditApplication(application)}
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
            )}
          </CardContent>

          {/* Pagination */}
          {!loading && paginatedApplications.length > 0 && (
            <div className="px-6 pb-6">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredApplications.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Loan Application Modal */}
      <LoanApplicationModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApplication(null);
        }}
        onSuccess={() => {
          loadApplications(); // Reload applications after successful creation
          setSelectedApplication(null);
        }}
        editData={selectedApplication}
      />

      {/* Loan Application View Modal */}
      <LoanApplicationViewModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        application={selectedApplication}
        onEdit={handleEditApplication}
      />
    </Layout>
  );
}