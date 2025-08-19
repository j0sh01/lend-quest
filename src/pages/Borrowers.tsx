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
  Phone,
  Mail,
  MapPin,
  User,
  Users,
  Building,
  CreditCard
} from 'lucide-react';

interface Borrower {
  name: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  borrower_type: 'Individual' | 'Business';
  email: string;
  mobile_no: string;
  address: string;
  city: string;
  state: string;
  kyc_status: 'Pending' | 'Verified' | 'Rejected';
  credit_score?: number;
  total_loans: number;
  active_loans: number;
  outstanding_amount: number;
  creation: string;
}

const mockBorrowers: Borrower[] = [
  {
    name: 'BORR-001',
    first_name: 'John',
    last_name: 'Doe',
    borrower_type: 'Individual',
    email: 'john.doe@email.com',
    mobile_no: '+1-555-0123',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    kyc_status: 'Verified',
    credit_score: 750,
    total_loans: 3,
    active_loans: 1,
    outstanding_amount: 16500,
    creation: '2023-01-15T10:30:00'
  },
  {
    name: 'BORR-002',
    first_name: 'Sarah',
    last_name: 'Wilson',
    borrower_type: 'Individual',
    email: 'sarah.wilson@email.com',
    mobile_no: '+1-555-0456',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    kyc_status: 'Verified',
    credit_score: 680,
    total_loans: 2,
    active_loans: 1,
    outstanding_amount: 23000,
    creation: '2023-02-20T14:15:00'
  },
  {
    name: 'BORR-003',
    company_name: 'ABC Corporation',
    borrower_type: 'Business',
    email: 'finance@abccorp.com',
    mobile_no: '+1-555-0789',
    address: '789 Business Plaza',
    city: 'Chicago',
    state: 'IL',
    kyc_status: 'Pending',
    total_loans: 1,
    active_loans: 1,
    outstanding_amount: 75000,
    creation: '2023-03-10T09:45:00'
  },
  {
    name: 'BORR-004',
    first_name: 'Mike',
    last_name: 'Johnson',
    borrower_type: 'Individual',
    email: 'mike.johnson@email.com',
    mobile_no: '+1-555-0321',
    address: '321 Pine Street',
    city: 'Houston',
    state: 'TX',
    kyc_status: 'Rejected',
    credit_score: 590,
    total_loans: 0,
    active_loans: 0,
    outstanding_amount: 0,
    creation: '2023-04-05T16:20:00'
  }
];

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [kycFilter, setKycFilter] = useState<string>('');

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBorrowers(mockBorrowers);
    } catch (error) {
      console.error('Failed to load borrowers:', error);
      setBorrowers(mockBorrowers);
    } finally {
      setLoading(false);
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    const name = borrower.borrower_type === 'Individual' 
      ? `${borrower.first_name} ${borrower.last_name || ''}`
      : borrower.company_name || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrower.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || borrower.borrower_type === typeFilter;
    const matchesKyc = !kycFilter || borrower.kyc_status === kycFilter;
    return matchesSearch && matchesType && matchesKyc;
  });

  const getKycVariant = (status: string) => {
    switch (status) {
      case 'Verified': return 'approved';
      case 'Pending': return 'pending';
      case 'Rejected': return 'rejected';
      default: return 'default';
    }
  };

  const getCreditScoreVariant = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 750) return 'approved';
    if (score >= 650) return 'default';
    return 'warning';
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

  const getBorrowerName = (borrower: Borrower) => {
    return borrower.borrower_type === 'Individual' 
      ? `${borrower.first_name} ${borrower.last_name || ''}`
      : borrower.company_name || '';
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Borrowers</h1>
            <p className="text-muted-foreground">Manage borrower profiles and relationships</p>
          </div>
          <Button variant="financial" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Borrower
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-financial" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Borrowers</p>
                  <p className="text-lg sm:text-2xl font-bold">{borrowers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-lg sm:text-2xl font-bold">{borrowers.filter(b => b.active_loans > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Business</p>
                  <p className="text-lg sm:text-2xl font-bold">{borrowers.filter(b => b.borrower_type === 'Business').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-approved" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">KYC Verified</p>
                  <p className="text-lg sm:text-2xl font-bold">{borrowers.filter(b => b.kyc_status === 'Verified').length}</p>
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
                  placeholder="Search borrowers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                </select>
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={kycFilter}
                  onChange={(e) => setKycFilter(e.target.value)}
                >
                  <option value="">All KYC</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Borrowers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Borrowers ({filteredBorrowers.length})</span>
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
                      <TableHead className="min-w-[140px]">Borrower ID</TableHead>
                      <TableHead className="min-w-[200px]">Name/Company</TableHead>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[180px]">Contact</TableHead>
                      <TableHead className="min-w-[180px]">Location</TableHead>
                      <TableHead className="min-w-[100px]">KYC Status</TableHead>
                      <TableHead className="min-w-[100px]">Credit Score</TableHead>
                      <TableHead className="min-w-[120px]">Outstanding</TableHead>
                      <TableHead className="min-w-[80px]">Loans</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBorrowers.map((borrower) => (
                      <TableRow key={borrower.name} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{borrower.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{getBorrowerName(borrower)}</div>
                            <div className="text-sm text-muted-foreground">
                              {borrower.borrower_type}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={borrower.borrower_type === 'Business' ? 'secondary' : 'default'}>
                            {borrower.borrower_type === 'Business' ? <Building className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                            <span className="hidden sm:inline">{borrower.borrower_type}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[120px]">{borrower.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {borrower.mobile_no}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{borrower.city}, {borrower.state}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getKycVariant(borrower.kyc_status)}>
                            {borrower.kyc_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {borrower.credit_score ? (
                            <Badge variant={getCreditScoreVariant(borrower.credit_score)}>
                              {borrower.credit_score}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {borrower.outstanding_amount > 0 
                            ? formatCurrency(borrower.outstanding_amount)
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{borrower.active_loans} active</div>
                            <div className="text-muted-foreground">{borrower.total_loans} total</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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