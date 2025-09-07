import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, DollarSign, Calendar, FileText, CheckCircle, User, Building } from 'lucide-react';

interface DisbursementViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disbursement: any;
  onEdit?: (disbursement: any) => void;
}

export function DisbursementViewModal({ 
  open, 
  onOpenChange, 
  disbursement, 
  onEdit 
}: DisbursementViewModalProps) {
  if (!disbursement) return null;

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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5" />
              Disbursement Details
              <Badge variant={getStatusVariant(disbursement.docstatus === 1 ? 'submitted' : 'draft')} className="flex items-center gap-1">
                {getStatusIcon(disbursement.docstatus === 1 ? 'submitted' : 'draft')}
                {disbursement.docstatus === 1 ? 'Submitted' : 'Draft'}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Disbursement Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Disbursement Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Disbursement ID</label>
                <p className="font-mono text-sm">{disbursement.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Disbursement Amount</label>
                <p className="font-bold text-xl text-green-600">{formatCurrency(disbursement.disbursed_amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Disbursement Date</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(disbursement.disbursement_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reference Number</label>
                <p className="font-mono text-sm">{disbursement.reference_number || 'N/A'}</p>
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
                <p className="font-mono text-sm">{disbursement.against_loan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Borrower</label>
                <p className="font-medium">{disbursement.customer || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {disbursement.company}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bank Account</label>
                <p>{disbursement.bank_account || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bank</label>
                <p>{disbursement.bank || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cost Center</label>
                <p>{disbursement.cost_center || 'N/A'}</p>
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
                <p>{formatDate(disbursement.creation)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                <p>{formatDate(disbursement.modified)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {disbursement.owner}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(disbursement.docstatus === 1 ? 'submitted' : 'draft')}>
                    {disbursement.docstatus === 1 ? 'Submitted' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          {disbursement.remarks && (
            <Card>
              <CardHeader>
                <CardTitle>Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{disbursement.remarks}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && disbursement.docstatus === 0 && (
              <Button onClick={() => onEdit(disbursement)}>
                Edit Disbursement
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
