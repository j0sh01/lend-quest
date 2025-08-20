// Core types for the lending system

export interface LoanApplication {
  name: string;
  applicant_type: 'Employee' | 'Borrower';
  applicant: string;
  applicant_name?: string;
  loan_product: string;
  loan_amount: number;
  rate_of_interest: number;
  repayment_schedule_type: 'Weekly' | 'Monthly' | 'Quarterly';
  repayment_periods: number;
  is_secured_loan: boolean;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  creation: string;
  modified: string;
  proposed_pledges?: SecurityPledge[];
}

export interface Loan {
  name: string;
  loan_application: string;
  applicant_type: 'Employee' | 'Borrower';
  applicant: string;
  applicant_name?: string;
  loan_product: string;
  loan_amount: number;
  disbursed_amount: number;
  rate_of_interest: number;
  repayment_schedule_type: 'Weekly' | 'Monthly' | 'Quarterly';
  repayment_periods: number;
  is_secured_loan: boolean;
  status: 'Sanctioned' | 'Partially Disbursed' | 'Fully Disbursed' | 'Closed' | 'Loan Closure Requested';
  total_payment: number;
  total_principal_paid: number;
  total_interest_payable: number;
  written_off_amount: number;
  outstanding_principal_amount?: number;
  disbursement_date?: string;
  repayment_start_date?: string;
  creation: string;
  modified: string;
}

export interface LoanDisbursement {
  name: string;
  against_loan: string;
  disbursement_date: string;
  disbursed_amount: number;
  bank_account: string;
  reference_number?: string;
  status: 'Draft' | 'Submitted' | 'Disbursed';
  creation: string;
  modified: string;
}

export interface LoanRepayment {
  name: string;
  against_loan: string;
  posting_date: string;
  amount_paid: number;
  mode_of_payment: string;
  reference_number?: string;
  repayment_type: 'Normal Repayment' | 'Prepayment' | 'Charges Waiver';
  status: 'Draft' | 'Submitted';
  creation: string;
  modified: string;
}

export interface LoanProduct {
  name: string;
  product_name: string;
  is_term_loan: boolean;
  maximum_loan_amount: number;
  rate_of_interest: number;
  penalty_interest_rate: number;
  grace_period_in_days: number;
  auto_create_repayment_periods: boolean;
  status: 'Active' | 'Disabled';
  creation: string;
  modified: string;
}

export interface Borrower {
  name: string;
  customer_name: string;
  customer_type: 'Individual' | 'Company';
  customer_group: string;
  territory: string;
  mobile_no?: string;
  email_id?: string;
  status: 'Active' | 'Disabled';
  creation: string;
  modified: string;
}

export interface SecurityPledge {
  name: string;
  loan: string;
  loan_security: string;
  loan_security_type: string;
  qty: number;
  loan_security_price: number;
  amount: number;
  haircut: number;
  status: 'Pledged' | 'Unpledged';
  creation: string;
  modified: string;
}

export interface DashboardMetrics {
  totalActiveLoans: number;
  totalDisbursed: number;
  pendingApplications: number;
  overdueLoans: number;
  totalPortfolioValue: number;
  averageInterestRate: number;
  monthlyDisbursements: ChartData[];
  portfolioByStatus: ChartData[];
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
  color?: string;
  count?: number;
}

export interface RecentActivity {
  type: string;
  name: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

// API Response types
export interface FrappeResponse<T> {
  data: T;
  message?: string;
}

export interface FrappeListResponse<T> {
  data: T[];
  message?: string;
}

// Form types
export interface LoanApplicationForm {
  applicant_type: 'Employee' | 'Borrower';
  applicant: string;
  loan_product: string;
  loan_amount: number;
  rate_of_interest: number;
  repayment_schedule_type: 'Weekly' | 'Monthly' | 'Quarterly';
  repayment_periods: number;
  is_secured_loan: boolean;
  proposed_pledges?: Partial<SecurityPledge>[];
}

export interface LoanRepaymentForm {
  against_loan: string;
  posting_date: string;
  amount_paid: number;
  mode_of_payment: string;
  reference_number?: string;
  repayment_type: 'Normal Repayment' | 'Prepayment' | 'Charges Waiver';
}

// Extended types for detailed views
export interface LoanDetails extends Loan {
  repayment_schedule: RepaymentScheduleItem[];
  disbursements: LoanDisbursement[];
  repayments: LoanRepayment[];
}

export interface RepaymentScheduleItem {
  due_date: string;
  principal_amount: number;
  interest_amount: number;
  total_payment: number;
  is_paid: boolean;
  paid_amount: number;
  balance_amount: number;
}

export interface BorrowerDetails extends Borrower {
  loan_count: number;
  total_exposure: number;
  total_disbursed: number;
  loans?: Loan[];
}

export interface LoanSecurity {
  name: string;
  loan_security_name: string;
  loan_security_type: string;
  loan_security_code?: string;
  haircut: number;
  unit_of_measure: string;
  disabled: boolean;
  creation: string;
  modified: string;
}

export interface LoanSecurityPledge {
  name: string;
  loan: string;
  loan_security: string;
  loan_security_name?: string;
  qty: number;
  loan_security_price: number;
  amount: number;
  haircut: number;
  status: 'Pledged' | 'Unpledged';
  creation: string;
  modified: string;
}

export interface SecuritySummary extends LoanSecurity {
  pledge_count: number;
  total_pledged_amount: number;
}

// API Response types for new endpoints
export interface LoanApplicationsSummaryResponse {
  applications: LoanApplication[];
  total_count: number;
}

export interface LoansSummaryResponse {
  loans: Loan[];
  total_count: number;
}

export interface DisbursementsSummaryResponse {
  disbursements: LoanDisbursement[];
  total_count: number;
  pending_count: number;
  pending_amount: number;
}

export interface RepaymentsSummaryResponse {
  repayments: LoanRepayment[];
  total_count: number;
  overdue_count: number;
}

export interface BorrowersSummaryResponse {
  borrowers: BorrowerDetails[];
  total_count: number;
  active_count: number;
}

export interface SecuritiesSummaryResponse {
  securities: SecuritySummary[];
  active_pledges: LoanSecurityPledge[];
  total_securities: number;
  active_pledges_count: number;
}

export interface LoanDetailsResponse {
  loan: Loan;
  repayment_schedule: RepaymentScheduleItem[];
  disbursements: LoanDisbursement[];
  repayments: LoanRepayment[];
}

// Form types for new functionality
export interface LoanDisbursementForm {
  against_loan: string;
  disbursement_date: string;
  disbursed_amount: number;
  bank_account?: string;
  reference_number?: string;
  submit?: boolean;
}

export interface BorrowerForm {
  customer_name: string;
  customer_type: 'Individual' | 'Company';
  customer_group?: string;
  territory?: string;
  mobile_no?: string;
  email_id?: string;
}

export interface LoanSecurityForm {
  loan_security_name: string;
  loan_security_type: string;
  loan_security_code?: string;
  haircut: number;
  unit_of_measure: string;
}

// Filter and search types
export interface LoanFilters {
  status?: string;
  applicant_type?: string;
  loan_product?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface BorrowerFilters {
  status?: string;
  customer_type?: string;
  search?: string;
}

export interface DisbursementFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface RepaymentFilters {
  repayment_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}