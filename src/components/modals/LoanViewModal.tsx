import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, DollarSign, User, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface LoanViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: any;
  onEdit?: (loan: any) => void;
}

export function LoanViewModal({ 
  open, 
  onOpenChange, 
  loan, 
  onEdit 
}: LoanViewModalProps) {
  if (!loan) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sanctioned': return 'success';
      case 'disbursed': return 'success';
      case 'partially disbursed': return 'secondary';
      case 'closed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sanctioned':
      case 'disbursed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const repaymentProgress = loan.total_amount_paid && loan.loan_amount 
    ? (loan.total_amount_paid / loan.loan_amount) * 100 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5" />
              Loan Details
              <Badge variant={getStatusVariant(loan.status)} className="flex items-center gap-1">
                {getStatusIcon(loan.status)}
                {loan.status}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Loan Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan ID</label>
                <p className="font-mono text-sm">{loan.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan Amount</label>
                <p className="font-bold text-xl">{formatCurrency(loan.loan_amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Interest Rate</label>
                <p className="font-semibold">{loan.rate_of_interest}% per annum</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan Product</label>
                <p>{loan.loan_product}</p>
              </div>
            </CardContent>
          </Card>

          {/* Borrower Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Borrower Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applicant Name</label>
                <p className="font-medium">{loan.applicant_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applicant ID</label>
                <p className="font-mono text-sm">{loan.applicant}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p>{loan.company}</p>
              </div>
            </CardContent>
          </Card>

          {/* Repayment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Repayment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Repayment Method</label>
                  <p>{loan.repayment_method}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Repayment Periods</label>
                  <p>{loan.repayment_periods}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Monthly Repayment</label>
                  <p className="font-semibold">{formatCurrency(loan.monthly_repayment_amount || 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Interest</label>
                  <p className="font-semibold">{formatCurrency(loan.total_interest_payable || 0)}</p>
                </div>
              </div>

              {/* Repayment Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-muted-foreground">Repayment Progress</label>
                  <span className="text-sm font-medium">{repaymentProgress.toFixed(1)}%</span>
                </div>
                <Progress value={repaymentProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Paid: {formatCurrency(loan.total_amount_paid || 0)}</span>
                  <span>Outstanding: {formatCurrency(loan.outstanding_principal_amount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Posting Date</label>
                <p>{formatDate(loan.posting_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Disbursement Date</label>
                <p>{formatDate(loan.disbursement_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Repayment Start Date</label>
                <p>{formatDate(loan.repayment_start_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Next Payment Date</label>
                <p>{formatDate(loan.next_payment_date)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Payable Amount</label>
                <p className="font-bold text-lg">{formatCurrency(loan.total_payable_amount || 0)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount Paid</label>
                <p className="font-semibold text-green-600">{formatCurrency(loan.total_amount_paid || 0)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Outstanding Principal</label>
                <p className="font-semibold text-orange-600">{formatCurrency(loan.outstanding_principal_amount || 0)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Outstanding Interest</label>
                <p className="font-semibold text-red-600">{formatCurrency(loan.outstanding_interest_amount || 0)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(loan)}>
                Edit Loan
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
