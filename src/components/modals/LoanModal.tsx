import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Loader2 } from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { toast } from 'sonner';

interface LoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface LoanFormData {
  applicant_type: 'Employee' | 'Borrower';
  applicant: string;
  applicant_name: string;
  company: string;
  loan_product: string;
  loan_amount: number;
  rate_of_interest: number;
  repayment_schedule_type: string;
  repayment_periods: number;
  repayment_start_date: string;
  is_secured_loan: boolean;
  description: string;
  repayment_method: string;
}

export function LoanModal({ open, onOpenChange, onSuccess }: LoanModalProps) {
  const [loading, setLoading] = useState(false);
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [formData, setFormData] = useState<LoanFormData>({
    applicant_type: 'Borrower',
    applicant: '',
    applicant_name: '',
    company: 'GT MICROFINANCE LIMITED',
    loan_product: '',
    loan_amount: 0,
    rate_of_interest: 0,
    repayment_schedule_type: 'Monthly',
    repayment_periods: 12,
    repayment_start_date: '',
    is_secured_loan: false,
    description: '',
    repayment_method: 'Repay Fixed Amount Over Number of Periods'
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
      loadLoanProducts();
      loadApplicants();
    }
  }, [open]);

  const loadLoanProducts = async () => {
    try {
      const products = await LoanService.getLoanProducts();
      setLoanProducts(products);
    } catch (error) {
      console.error('Failed to load loan products:', error);
      toast.error('Failed to load loan products');
    }
  };

  const loadApplicants = async () => {
    try {
      if (formData.applicant_type === 'Employee') {
        const employees = await LoanService.getEmployees();
        setApplicants(employees);
      } else {
        const borrowers = await LoanService.getBorrowers();
        setApplicants(borrowers.map(borrower => ({
          name: borrower.name,
          full_name: borrower.full_name,
          customer_name: borrower.full_name
        })));
      }
    } catch (error) {
      console.error('Failed to load applicants:', error);
      toast.error('Failed to load applicants');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicant || !formData.loan_product || !formData.loan_amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.loan_amount <= 0) {
      toast.error('Loan amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      
      // Create loan directly (not loan application)
      const loanData = {
        ...formData,
        posting_date: new Date().toISOString().split('T')[0],
        status: 'Draft'
      };
      
      await LoanService.createLoan(loanData);
      toast.success('Loan created successfully');
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        applicant_type: 'Borrower',
        applicant: '',
        applicant_name: '',
        company: 'GT MICROFINANCE LIMITED',
        loan_product: '',
        loan_amount: 0,
        rate_of_interest: 0,
        repayment_schedule_type: 'Monthly',
        repayment_periods: 12,
        repayment_start_date: '',
        is_secured_loan: false,
        description: '',
        repayment_method: 'Repay Fixed Amount Over Number of Periods'
      });
    } catch (error) {
      console.error('Failed to create loan:', error);
      toast.error('Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicantChange = (applicantId: string) => {
    const selectedApplicant = applicants.find(app => app.name === applicantId);
    setFormData(prev => ({
      ...prev,
      applicant: applicantId,
      applicant_name: selectedApplicant?.employee_name || selectedApplicant?.customer_name || selectedApplicant?.full_name || ''
    }));
  };

  const handleProductChange = (productName: string) => {
    const selectedProduct = loanProducts.find(product => product.name === productName);
    setFormData(prev => ({
      ...prev,
      loan_product: productName,
      rate_of_interest: selectedProduct?.rate_of_interest || 0
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create New Loan
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applicant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="applicant_type">Applicant Type *</Label>
                  <Select
                    value={formData.applicant_type}
                    onValueChange={(value: 'Employee' | 'Borrower') => 
                      setFormData(prev => ({ ...prev, applicant_type: value, applicant: '' }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Borrower">Borrower</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="applicant">Applicant *</Label>
                  <Select
                    value={formData.applicant}
                    onValueChange={handleApplicantChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicant" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicants.map((applicant) => (
                        <SelectItem key={applicant.name} value={applicant.name}>
                          {applicant.employee_name || applicant.customer_name || applicant.full_name}
                        </SelectItem>
                      ))}
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

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loan_product">Loan Product *</Label>
                  <Select
                    value={formData.loan_product}
                    onValueChange={handleProductChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan product" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanProducts.map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                          {product.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="loan_amount">Loan Amount (TZS) *</Label>
                  <Input
                    id="loan_amount"
                    type="number"
                    value={formData.loan_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, loan_amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter loan amount"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="rate_of_interest">Interest Rate (%)</Label>
                  <Input
                    id="rate_of_interest"
                    type="number"
                    value={formData.rate_of_interest}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate_of_interest: parseFloat(e.target.value) || 0 }))}
                    placeholder="Interest rate"
                    step="0.01"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Loan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
