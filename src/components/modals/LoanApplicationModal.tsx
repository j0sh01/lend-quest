import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { toast } from 'sonner';

interface LoanApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editData?: any;
}

interface LoanApplicationFormData {
  applicant_type: 'Employee' | 'Borrower';
  applicant: string;
  company: string;
  loan_product: string;
  loan_amount: number;
  description: string;
  repayment_schedule_type: 'Weekly' | 'Monthly' | 'Quarterly';
  repayment_periods: number;
  day_of_the_month: number;
  is_secured_loan: boolean;
  repayment_method: string;
  posting_date: string;
  status: 'Open' | 'Approved' | 'Rejected';
}

interface LoanProduct {
  name: string;
  product_name: string;
  maximum_loan_amount: number;
  rate_of_interest: number;
  status: string;
}

interface Applicant {
  name: string;
  full_name?: string;
  customer_name?: string;
  employee_name?: string;
}

export function LoanApplicationModal({ open, onClose, onSuccess, editData }: LoanApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  
  const [formData, setFormData] = useState<LoanApplicationFormData>({
    applicant_type: 'Borrower',
    applicant: '',
    company: 'GT MICROFINANCE LIMITED',
    loan_product: '',
    loan_amount: 0,
    description: '',
    repayment_schedule_type: 'Monthly',
    repayment_periods: 12,
    day_of_the_month: 1,
    is_secured_loan: false,
    repayment_method: 'Repay Fixed Amount Over Number of Periods',
    posting_date: new Date().toISOString().split('T')[0],
    status: 'Open'
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

  useEffect(() => {
    if (editData && open) {
      setFormData({
        applicant_type: editData.applicant_type || 'Borrower',
        applicant: editData.applicant || '',
        company: editData.company || 'GT MICROFINANCE LIMITED',
        loan_product: editData.loan_product || '',
        loan_amount: editData.loan_amount || 0,
        description: editData.description || '',
        repayment_schedule_type: editData.repayment_schedule_type || 'Monthly',
        repayment_periods: editData.repayment_periods || 12,
        day_of_the_month: editData.day_of_the_month || 1,
        is_secured_loan: editData.is_secured_loan || false,
        repayment_method: editData.repayment_method || 'Repay Fixed Amount Over Number of Periods',
        posting_date: editData.posting_date || new Date().toISOString().split('T')[0],
        status: editData.status || 'Open'
      });
    } else if (open && !editData) {
      resetForm();
    }
  }, [editData, open]);

  useEffect(() => {
    if (formData.applicant_type) {
      loadApplicants();
    }
  }, [formData.applicant_type]);

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
        setApplicants(employees.map(emp => ({
          name: emp.name,
          employee_name: emp.employee_name,
          full_name: emp.employee_name
        })));
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

  const handleProductChange = (productName: string) => {
    const product = loanProducts.find(p => p.name === productName);
    setSelectedProduct(product || null);
    setFormData(prev => ({
      ...prev,
      loan_product: productName,
      loan_amount: 0 // Reset amount when product changes
    }));
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

    if (selectedProduct && selectedProduct.maximum_loan_amount > 0 && formData.loan_amount > selectedProduct.maximum_loan_amount) {
      toast.error(`Loan amount cannot exceed ${formatCurrency(selectedProduct.maximum_loan_amount)}`);
      return;
    }

    try {
      setLoading(true);

      // Ensure data is properly formatted - handle undefined/null values safely
      const applicationData = {
        ...formData,
        loan_amount: parseFloat(String(formData.loan_amount || 0)) || 0,
        rate_of_interest: parseFloat(String(formData.rate_of_interest || 0)) || 0,
        repayment_periods: parseInt(String(formData.repayment_periods || 12)) || 12,
        posting_date: formData.posting_date || new Date().toISOString().split('T')[0],
        is_secured_loan: Boolean(formData.is_secured_loan)
      };

      let result;
      if (editData) {
        result = await LoanService.updateLoanApplication(editData.name, applicationData);
      } else {
        result = await LoanService.createLoanApplication(applicationData);
      }

      if (result.success) {
        toast.success(result.message || `Loan application ${editData ? 'updated' : 'created'} successfully`);
        onSuccess?.();
        onClose();
        if (!editData) resetForm();
      } else {
        toast.error(result.message || `Failed to ${editData ? 'update' : 'create'} loan application`);
      }
    } catch (error) {
      console.error('Failed to create loan application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create loan application';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      applicant_type: 'Borrower',
      applicant: '',
      company: 'GT MICROFINANCE LIMITED',
      loan_product: '',
      loan_amount: 0,
      description: '',
      repayment_schedule_type: 'Monthly',
      repayment_periods: 12,
      day_of_the_month: 1,
      is_secured_loan: false,
      repayment_method: 'Repay Fixed Amount Over Number of Periods',
      posting_date: new Date().toISOString().split('T')[0],
      status: 'Open'
    });
    setSelectedProduct(null);
  };

  const getApplicantDisplayName = (applicant: Applicant) => {
    return applicant.full_name || applicant.customer_name || applicant.employee_name || applicant.name;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editData ? 'Edit Loan Application' : 'New Loan Application'}
            <Button variant="ghost" size="sm" onClick={onClose}>
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
                      <SelectValue />
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, applicant: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicant" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicants.map((applicant) => (
                        <SelectItem key={applicant.name} value={applicant.name}>
                          {getApplicantDisplayName(applicant)}
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
                    placeholder="Enter company name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Loan Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Information</CardTitle>
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
                  <Label htmlFor="loan_amount">Loan Amount *</Label>
                  <Input
                    id="loan_amount"
                    type="number"
                    value={formData.loan_amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, loan_amount: Number(e.target.value) }))}
                    placeholder="Enter loan amount"
                  />
                  {selectedProduct && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Maximum: {selectedProduct.maximum_loan_amount.toLocaleString()} | 
                      Interest Rate: {selectedProduct.rate_of_interest}%
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Purpose/Reason</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the purpose of the loan"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Repayment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repayment Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="repayment_schedule_type">Repayment Schedule</Label>
                <Select
                  value={formData.repayment_schedule_type}
                  onValueChange={(value: 'Weekly' | 'Monthly' | 'Quarterly') => 
                    setFormData(prev => ({ ...prev, repayment_schedule_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="repayment_periods">Repayment Periods</Label>
                <Input
                  id="repayment_periods"
                  type="number"
                  value={formData.repayment_periods}
                  onChange={(e) => setFormData(prev => ({ ...prev, repayment_periods: Number(e.target.value) }))}
                  min="1"
                />
              </div>

              {formData.repayment_schedule_type === 'Monthly' && (
                <div>
                  <Label htmlFor="day_of_the_month">Day of the Month</Label>
                  <Input
                    id="day_of_the_month"
                    type="number"
                    value={formData.day_of_the_month}
                    onChange={(e) => setFormData(prev => ({ ...prev, day_of_the_month: Number(e.target.value) }))}
                    min="1"
                    max="31"
                    placeholder="Day for monthly payments (1-31)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Specify which day of the month payments are due
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="repayment_method">Repayment Method</Label>
                <Select
                  value={formData.repayment_method}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, repayment_method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Repay Fixed Amount Over Number of Periods">
                      Fixed Amount Over Periods
                    </SelectItem>
                    <SelectItem value="Repay Redusing Amount Over Number per Period">
                      Reducing Amount Over Periods
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security & Status Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security & Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Application Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'Open' | 'Approved' | 'Rejected') =>
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_secured_loan"
                  checked={formData.is_secured_loan}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, is_secured_loan: checked as boolean }))
                  }
                />
                <Label htmlFor="is_secured_loan">This is a secured loan</Label>
              </div>
              {formData.is_secured_loan && (
                <p className="text-sm text-muted-foreground mt-2">
                  Security pledges can be added after the application is approved.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
