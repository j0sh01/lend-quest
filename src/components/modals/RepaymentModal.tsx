import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Loader2 } from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { toast } from 'sonner';

interface RepaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface RepaymentFormData {
  against_loan: string;
  posting_date: string;
  amount_paid: number;
  repayment_type: string;
  payment_account: string;
  company: string;
}

export function RepaymentModal({ open, onOpenChange, onSuccess }: RepaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [formData, setFormData] = useState<RepaymentFormData>({
    against_loan: '',
    posting_date: new Date().toISOString().split('T')[0],
    amount_paid: 0,
    repayment_type: 'Normal Repayment',
    payment_account: 'Bank Account - GML',
    company: 'GT MICROFINANCE LIMITED'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    if (open) {
      loadLoans();
    }
  }, [open]);

  const loadLoans = async () => {
    try {
      const response = await LoanService.getLoansSummary();
      setLoans(response.loans || []);
    } catch (error) {
      console.error('Failed to load loans:', error);
      toast.error('Failed to load loans');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.against_loan || !formData.amount_paid || formData.amount_paid <= 0) {
      toast.error('Please fill in all required fields with valid amounts');
      return;
    }

    try {
      setLoading(true);
      
      // Create repayment using Frappe API
      const repaymentData = {
        doctype: 'Loan Repayment',
        ...formData
      };
      
      await LoanService.createRepayment(repaymentData);
      toast.success('Repayment recorded successfully');
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        against_loan: '',
        posting_date: new Date().toISOString().split('T')[0],
        amount_paid: 0,
        repayment_type: 'Normal Repayment',
        payment_account: 'Bank Account - GML',
        company: 'GT MICROFINANCE LIMITED'
      });
    } catch (error) {
      console.error('Failed to record repayment:', error);
      toast.error('Failed to record repayment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Record Loan Repayment
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repayment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="against_loan">Loan *</Label>
                <Select
                  value={formData.against_loan}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, against_loan: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan" />
                  </SelectTrigger>
                  <SelectContent>
                    {loans.map((loan) => (
                      <SelectItem key={loan.name} value={loan.name}>
                        {loan.name} - {loan.applicant_name} ({formatCurrency(loan.outstanding_principal_amount || 0)} outstanding)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="posting_date">Payment Date *</Label>
                  <Input
                    id="posting_date"
                    type="date"
                    value={formData.posting_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, posting_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount_paid">Amount Paid (TZS) *</Label>
                  <Input
                    id="amount_paid"
                    type="number"
                    value={formData.amount_paid}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount_paid: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter amount paid"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="repayment_type">Repayment Type</Label>
                <Select
                  value={formData.repayment_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, repayment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select repayment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal Repayment">Normal Repayment</SelectItem>
                    <SelectItem value="Early Repayment">Early Repayment</SelectItem>
                    <SelectItem value="Partial Repayment">Partial Repayment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_account">Payment Account</Label>
                <Select
                  value={formData.payment_account}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_account: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Account - GML">Bank Account - GML</SelectItem>
                    <SelectItem value="Cash Account - GML">Cash Account - GML</SelectItem>
                    <SelectItem value="Mobile Money - GML">Mobile Money - GML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Repayment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
