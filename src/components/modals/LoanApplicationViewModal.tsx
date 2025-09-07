import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User, Building, DollarSign, Calendar, FileText, Shield } from 'lucide-react';

interface LoanApplicationViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
  onEdit?: (application: any) => void;
}

export function LoanApplicationViewModal({ 
  open, 
  onOpenChange, 
  application, 
  onEdit 
}: LoanApplicationViewModalProps) {
  if (!application) return null;

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'destructive';
      case 'Open': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              Loan Application Details
              <Badge variant={getStatusVariant(application.status)}>
                {application.status}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Application Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Application ID</label>
                <p className="font-mono text-sm">{application.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p>{formatDate(application.creation)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={getStatusVariant(application.status)}>
                  {application.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p>{application.company}</p>
              </div>
            </CardContent>
          </Card>

          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applicant Type</label>
                <p>{application.applicant_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applicant Name</label>
                <p className="font-medium">{application.applicant_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applicant ID</label>
                <p className="font-mono text-sm">{application.applicant}</p>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan Product</label>
                <p className="font-medium">{application.loan_product}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loan Amount</label>
                <p className="font-bold text-lg">{formatCurrency(application.loan_amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Interest Rate</label>
                <p>{application.rate_of_interest}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Secured Loan</label>
                <Badge variant={application.is_secured_loan ? 'success' : 'secondary'}>
                  {application.is_secured_loan ? 'Yes' : 'No'}
                </Badge>
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
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Schedule Type</label>
                <p>{application.repayment_schedule_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Repayment Periods</label>
                <p>{application.repayment_periods}</p>
              </div>
              {application.day_of_the_month && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Day of Month</label>
                  <p>{application.day_of_the_month}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Repayment Method</label>
                <p className="text-sm">{application.repayment_method}</p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {application.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{application.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(application)}>
                Edit Application
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
