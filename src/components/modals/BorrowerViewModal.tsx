import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User, MapPin, Phone, Mail, Building, DollarSign } from 'lucide-react';

interface BorrowerViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrower: any;
  onEdit?: (borrower: any) => void;
}

export function BorrowerViewModal({ 
  open, 
  onOpenChange, 
  borrower, 
  onEdit 
}: BorrowerViewModalProps) {
  if (!borrower) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              Borrower Details
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Borrower ID</label>
                <p className="font-mono text-sm">{borrower.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium text-lg">{borrower.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Borrower Type</label>
                <Badge variant="outline">{borrower.borrower_type}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p>{formatDate(borrower.date_of_birth)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p>{borrower.gender || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                <p>{borrower.marital_status || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {borrower.mobile_number}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {borrower.email_id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {borrower.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p>{borrower.address}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p>{borrower.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">State/Region</label>
                  <p>{borrower.state || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Country</label>
                  <p>{borrower.country || 'Not provided'}</p>
                </div>
              </div>
              {borrower.pincode && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                  <p>{borrower.pincode}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                <p>{borrower.occupation || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
                <p className="font-bold text-lg">
                  {borrower.annual_income ? formatCurrency(borrower.annual_income) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {borrower.company}
                </p>
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
                <p>{formatDate(borrower.creation)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                <p>{formatDate(borrower.modified)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p>{borrower.owner}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Modified By</label>
                <p>{borrower.modified_by}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(borrower)}>
                Edit Borrower
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
