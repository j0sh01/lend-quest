import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { toast } from 'sonner';

interface BorrowerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface BorrowerFormData {
  full_name: string;
  borrower_type: string;
  mobile_number: string;
  email_id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  occupation: string;
  annual_income: number;
  company: string;
}

export function BorrowerModal({ open, onOpenChange, onSuccess }: BorrowerModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BorrowerFormData>({
    full_name: '',
    borrower_type: 'Individual',
    mobile_number: '',
    email_id: '',
    address: '',
    city: '',
    state: '',
    country: 'Tanzania',
    pincode: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    occupation: '',
    annual_income: 0,
    company: 'GT MICROFINANCE LIMITED'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.mobile_number || !formData.email_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      await LoanService.createBorrower(formData);
      toast.success('Borrower created successfully');
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        full_name: '',
        borrower_type: 'Individual',
        mobile_number: '',
        email_id: '',
        address: '',
        city: '',
        state: '',
        country: 'Tanzania',
        pincode: '',
        date_of_birth: '',
        gender: '',
        marital_status: '',
        occupation: '',
        annual_income: 0,
        company: 'GT MICROFINANCE LIMITED'
      });
    } catch (error) {
      console.error('Failed to create borrower:', error);
      toast.error('Failed to create borrower');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create New Borrower
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="borrower_type">Borrower Type</Label>
                  <Select
                    value={formData.borrower_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, borrower_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select borrower type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mobile_number">Mobile Number *</Label>
                  <Input
                    id="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email_id">Email *</Label>
                  <Input
                    id="email_id"
                    type="email"
                    value={formData.email_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_id: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Address & Other Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address & Other Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Region</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state/region"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    placeholder="Enter occupation"
                  />
                </div>

                <div>
                  <Label htmlFor="annual_income">Annual Income (TZS)</Label>
                  <Input
                    id="annual_income"
                    type="number"
                    value={formData.annual_income}
                    onChange={(e) => setFormData(prev => ({ ...prev, annual_income: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter annual income"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select
                    value={formData.marital_status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, marital_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
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
              Create Borrower
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
