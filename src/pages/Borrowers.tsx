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
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Building,
  User,
  Phone,
  Mail,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { BorrowerDetails } from '@/types/loan';
import { PaginationWrapper } from '@/components/common/DataPagination';
import { BorrowerModal } from '@/components/modals/BorrowerModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState<BorrowerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [showBorrowerModal, setShowBorrowerModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    try {
      setLoading(true);
      const data = await LoanService.getBorrowersSummary() as any;

      // Ensure data has proper structure
      const validatedBorrowers = Array.isArray(data.borrowers) ? data.borrowers.map((borrower: any) => ({
        ...borrower,
        name: borrower.name || '',
        customer_name: borrower.customer_name || '',
        customer_type: borrower.customer_type || 'Individual',
        mobile_no: borrower.mobile_no || '',
        email_id: borrower.email_id || '',
        status: borrower.status || 'Active',
        loan_count: borrower.loan_count || 0,
        total_exposure: borrower.total_exposure || 0,
        total_disbursed: borrower.total_disbursed || 0
      })) : [];

      setBorrowers(validatedBorrowers);
      setTotalCount(data.total_count || 0);
      setActiveCount(data.active_count || 0);
    } catch (error) {
      console.error('Failed to load borrowers:', error);
      toast.error('Failed to load borrowers');
    } finally {
      setLoading(false);
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesSearch = borrower.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrower.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrower.email_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || borrower.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBorrowers.length / pageSize);
  const paginatedBorrowers = filteredBorrowers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewBorrower = (borrowerId: string) => {
    navigate(`/borrowers/${borrowerId}`);
  };

  const handleEditBorrower = (borrowerId: string) => {
    navigate(`/borrowers/${borrowerId}/edit`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCustomerTypeIcon = (type: string) => {
    return type === 'Individual' ? User : Building;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success' as const;
      case 'Inactive':
        return 'secondary' as const;
      case 'Suspended':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
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

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Borrowers</h1>
            <p className="text-muted-foreground">Manage borrower profiles and relationships</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadBorrowers} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="financial"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setShowBorrowerModal(true)}
            >
              <Plus className="h-4 w-4" />
              New Borrower
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Borrowers</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">{activeCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">With Loans</p>
                  <p className="text-2xl font-bold text-warning">
                    {borrowers.filter(b => b.loan_count > 0).length}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Exposure</p>
                  <p className="text-2xl font-bold text-financial">
                    {formatCurrency(borrowers.reduce((sum, b) => sum + (b.total_exposure || 0), 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-financial" />
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
                  placeholder="Search borrowers by name, email, or ID..."
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Borrowers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Borrowers ({filteredBorrowers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Borrower</TableHead>
                    <TableHead className="min-w-[120px]">Type</TableHead>
                    <TableHead className="min-w-[150px]">Contact</TableHead>
                    <TableHead className="min-w-[100px]">Loans</TableHead>
                    <TableHead className="min-w-[120px]">Total Exposure</TableHead>
                    <TableHead className="min-w-[120px]">Disbursed</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBorrowers.map((borrower) => {
                    const CustomerIcon = getCustomerTypeIcon(borrower.customer_type);
                    return (
                      <TableRow key={borrower.name} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CustomerIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{borrower.customer_name}</div>
                              <div className="text-sm text-muted-foreground font-mono">{borrower.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{borrower.customer_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {borrower.mobile_no && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {borrower.mobile_no}
                              </div>
                            )}
                            {borrower.email_id && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {borrower.email_id}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{borrower.loan_count || 0}</div>
                            <div className="text-xs text-muted-foreground">loans</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(borrower.total_exposure || 0)}
                        </TableCell>
                        <TableCell className="font-medium text-success">
                          {formatCurrency(borrower.total_disbursed || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(borrower.status)}>
                            {borrower.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewBorrower(borrower.name)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBorrower(borrower.name)}
                              title="Edit Borrower"
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

              {filteredBorrowers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No borrowers found matching your criteria
                </div>
              )}
            </div>
          </CardContent>

          {/* Pagination */}
          {!loading && paginatedBorrowers.length > 0 && (
            <div className="px-6 pb-6">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredBorrowers.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Borrower Modal */}
      <BorrowerModal
        open={showBorrowerModal}
        onOpenChange={setShowBorrowerModal}
        onSuccess={() => {
          loadBorrowers();
          setShowBorrowerModal(false);
        }}
      />
    </Layout>
  );
}