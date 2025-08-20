import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, DollarSign, Calendar, User, Building } from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { toast } from 'sonner';

export function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadLoanDetails();
    }
  }, [id]);

  const loadLoanDetails = async () => {
    try {
      setLoading(true);
      const response = await LoanService.getLoanDetails(id!);
      setLoan(response.loan);
    } catch (error) {
      console.error('Failed to load loan details:', error);
      toast.error('Failed to load loan details');
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 p-4 sm:p-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (!loan) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold mb-4">Loan Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested loan could not be found.</p>
          <Button onClick={() => navigate('/loans')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Loans
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 sm:p-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/loans')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{loan.name}</h1>
              <p className="text-muted-foreground">Loan Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/loans/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Loan Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{loan.applicant_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <Badge variant="outline">{loan.applicant_type}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applicant ID</label>
                <p className="font-mono text-sm">{loan.applicant}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan Product</label>
                <p className="font-medium">{loan.loan_product}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan Amount</label>
                <p className="font-medium text-lg">{formatCurrency(loan.loan_amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Interest Rate</label>
                <p className="font-medium">{loan.rate_of_interest}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={loan.status === 'Sanctioned' ? 'success' : 'secondary'}>
                  {loan.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Disbursed Amount</p>
                <p className="text-xl font-bold">{formatCurrency(loan.disbursed_amount || 0)}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Payment</p>
                <p className="text-xl font-bold">{formatCurrency(loan.total_payment || 0)}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Principal Paid</p>
                <p className="text-xl font-bold">{formatCurrency(loan.total_principal_paid || 0)}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-xl font-bold">{formatCurrency(loan.outstanding_principal_amount || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repayment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Repayment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Schedule Type</label>
                <p className="font-medium">{loan.repayment_schedule_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Repayment Periods</label>
                <p className="font-medium">{loan.repayment_periods}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                <p className="font-medium">{loan.repayment_start_date ? formatDate(loan.repayment_start_date) : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
