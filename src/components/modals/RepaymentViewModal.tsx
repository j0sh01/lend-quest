import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, DollarSign, Calendar, CreditCard, FileText, CheckCircle } from 'lucide-react';

interface RepaymentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repayment: any;
  onEdit?: (repayment: any) => void;
}

export function RepaymentViewModal({ 
  open, 
  onOpenChange, 
  repayment, 
  onEdit 
}: RepaymentViewModalProps) {
  if (!repayment) return null;

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
      case 'submitted': return 'success';
      case 'draft': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              Repayment Details
              <Badge variant={getStatusVariant(repayment.docstatus === 1 ? 'submitted' : 'draft')}>
                {repayment.docstatus === 1 ? 'Submitted' : 'Draft'}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Repayment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Repayment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Repayment ID</label>
                <p className="font-mono text-sm">{repayment.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
                <p className="font-bold text-xl text-green-600">{formatCurrency(repayment.amount_paid)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(repayment.posting_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Repayment Type</label>
                <Badge variant="outline">{repayment.repayment_type}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Loan Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Loan Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan ID</label>
                <p className="font-mono text-sm">{repayment.against_loan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Borrower</label>
                <p className="font-medium">{repayment.applicant_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p>{repayment.company}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Account</label>
                  <p>{repayment.payment_account}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <p>{repayment.mode_of_payment || 'Not specified'}</p>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-3">Amount Breakdown</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Principal Amount:</span>
                    <span className="font-medium">{formatCurrency(repayment.principal_amount_paid || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Amount:</span>
                    <span className="font-medium">{formatCurrency(repayment.interest_amount_paid || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Penalty Amount:</span>
                    <span className="font-medium">{formatCurrency(repayment.penalty_amount_paid || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee Amount:</span>
                    <span className="font-medium">{formatCurrency(repayment.fee_amount_paid || 0)}</span>
                  </div>
                  <div className="col-span-2 border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">{formatCurrency(repayment.amount_paid)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p>{formatDate(repayment.creation)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                <p>{formatDate(repayment.modified)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p>{repayment.owner}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge variant={getStatusVariant(repayment.docstatus === 1 ? 'submitted' : 'draft')}>
                    {repayment.docstatus === 1 ? 'Submitted' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          {repayment.remarks && (
            <Card>
              <CardHeader>
                <CardTitle>Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{repayment.remarks}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && repayment.docstatus === 0 && (
              <Button onClick={() => onEdit(repayment)}>
                Edit Repayment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
