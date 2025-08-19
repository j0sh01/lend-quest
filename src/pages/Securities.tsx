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
  Shield,
  Home,
  Car,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface Security {
  name: string;
  loan: string;
  loan_name: string;
  borrower_name: string;
  security_type: 'Property' | 'Vehicle' | 'Fixed Deposit' | 'Stock' | 'Gold' | 'Equipment';
  security_name: string;
  security_value: number;
  pledged_qty: number;
  uom: string;
  current_pledged_value: number;
  loan_amount: number;
  coverage_ratio: number;
  valuation_date: string;
  status: 'Pledged' | 'Released' | 'Partially Released';
  creation: string;
}

const mockSecurities: Security[] = [
  {
    name: 'SEC-2024-001',
    loan: 'LOAN-2024-002',
    loan_name: 'LOAN-2024-002',
    borrower_name: 'ABC Corporation',
    security_type: 'Property',
    security_name: 'Commercial Building - Downtown',
    security_value: 200000,
    pledged_qty: 1,
    uom: 'Unit',
    current_pledged_value: 180000,
    loan_amount: 150000,
    coverage_ratio: 120,
    valuation_date: '2024-01-10',
    status: 'Pledged',
    creation: '2024-01-10T09:15:00'
  },
  {
    name: 'SEC-2024-002',
    loan: 'LOAN-2024-003',
    loan_name: 'LOAN-2024-003',
    borrower_name: 'Sarah Wilson',
    security_type: 'Vehicle',
    security_name: '2022 Toyota Camry',
    security_value: 35000,
    pledged_qty: 1,
    uom: 'Unit',
    current_pledged_value: 32000,
    loan_amount: 35000,
    coverage_ratio: 91,
    valuation_date: '2023-12-15',
    status: 'Pledged',
    creation: '2023-12-15T11:45:00'
  },
  {
    name: 'SEC-2024-003',
    loan: 'LOAN-2024-004',
    loan_name: 'LOAN-2024-004',
    borrower_name: 'Tech Innovations Ltd',
    security_type: 'Fixed Deposit',
    security_name: 'FD Certificate #FD123456',
    security_value: 50000,
    pledged_qty: 1,
    uom: 'Unit',
    current_pledged_value: 52000,
    loan_amount: 40000,
    coverage_ratio: 130,
    valuation_date: '2024-01-05',
    status: 'Pledged',
    creation: '2024-01-05T14:30:00'
  },
  {
    name: 'SEC-2024-004',
    loan: 'LOAN-2024-005',
    loan_name: 'LOAN-2024-005',
    borrower_name: 'Mike Johnson',
    security_type: 'Equipment',
    security_name: 'Manufacturing Equipment Set',
    security_value: 80000,
    pledged_qty: 5,
    uom: 'Units',
    current_pledged_value: 70000,
    loan_amount: 65000,
    coverage_ratio: 108,
    valuation_date: '2023-11-20',
    status: 'Partially Released',
    creation: '2023-11-20T16:20:00'
  }
];

export default function Securities() {
  const [securities, setSecurities] = useState<Security[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadSecurities();
  }, []);

  const loadSecurities = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSecurities(mockSecurities);
    } catch (error) {
      console.error('Failed to load securities:', error);
      setSecurities(mockSecurities);
    } finally {
      setLoading(false);
    }
  };

  const filteredSecurities = securities.filter(security => {
    const matchesSearch = security.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         security.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         security.security_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || security.security_type === typeFilter;
    const matchesStatus = !statusFilter || security.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pledged': return 'default';
      case 'Released': return 'secondary';
      case 'Partially Released': return 'pending';
      default: return 'default';
    }
  };

  const getCoverageVariant = (ratio: number) => {
    if (ratio >= 120) return 'approved';
    if (ratio >= 100) return 'default';
    return 'warning';
  };

  const getSecurityIcon = (type: string) => {
    switch (type) {
      case 'Property': return Home;
      case 'Vehicle': return Car;
      case 'Fixed Deposit': return DollarSign;
      case 'Equipment': return Briefcase;
      default: return Shield;
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

  const totalPledgedValue = securities
    .filter(s => s.status === 'Pledged')
    .reduce((sum, s) => sum + s.current_pledged_value, 0);

  const averageCoverage = securities.length > 0 
    ? Math.round(securities.reduce((sum, s) => sum + s.coverage_ratio, 0) / securities.length)
    : 0;

  const underCollateralized = securities.filter(s => s.coverage_ratio < 100).length;

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Securities Management</h1>
            <p className="text-muted-foreground">Monitor collateral and security coverage</p>
          </div>
          <Button variant="financial" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Security
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-financial" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Pledged</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(totalPledgedValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Coverage</p>
                  <p className="text-lg sm:text-2xl font-bold">{averageCoverage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-approved" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Securities</p>
                  <p className="text-lg sm:text-2xl font-bold">{securities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Under-Collateralized</p>
                  <p className="text-lg sm:text-2xl font-bold">{underCollateralized}</p>
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
                  placeholder="Search securities..."
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
                  <option value="Property">Property</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Stock">Stock</option>
                  <option value="Gold">Gold</option>
                </select>
                <select
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm w-full sm:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Pledged">Pledged</option>
                  <option value="Partially Released">Partially Released</option>
                  <option value="Released">Released</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Securities Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Securities ({filteredSecurities.length})</span>
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
                      <TableHead className="min-w-[140px]">Security ID</TableHead>
                      <TableHead className="min-w-[140px]">Loan ID</TableHead>
                      <TableHead className="min-w-[160px]">Borrower</TableHead>
                      <TableHead className="min-w-[180px]">Security Details</TableHead>
                      <TableHead className="min-w-[120px]">Type</TableHead>
                      <TableHead className="min-w-[120px]">Value</TableHead>
                      <TableHead className="min-w-[120px]">Pledged Value</TableHead>
                      <TableHead className="min-w-[100px]">Coverage</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Valuation Date</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSecurities.map((security) => {
                      const SecurityIcon = getSecurityIcon(security.security_type);
                      return (
                        <TableRow key={security.name} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{security.name}</TableCell>
                          <TableCell className="font-mono text-sm">{security.loan_name}</TableCell>
                          <TableCell>
                            <div className="font-medium">{security.borrower_name}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{security.security_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {security.pledged_qty} {security.uom}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1">
                              <SecurityIcon className="h-3 w-3" />
                              <span className="hidden sm:inline">{security.security_type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(security.security_value)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(security.current_pledged_value)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getCoverageVariant(security.coverage_ratio)}>
                              {security.coverage_ratio}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(security.status)}>
                              {security.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(security.valuation_date)}
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