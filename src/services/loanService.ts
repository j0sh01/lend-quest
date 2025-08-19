import { FrappeAPI } from '@/lib/api';
import { 
  Loan, 
  LoanApplication, 
  LoanDisbursement, 
  LoanRepayment, 
  LoanProduct, 
  Borrower,
  DashboardMetrics,
  LoanApplicationForm,
  LoanRepaymentForm
} from '@/types/loan';

export class LoanService {
  // Loan Applications
  static async getLoanApplications() {
    return FrappeAPI.getList<LoanApplication>('Loan Application', {
      fields: ['name', 'applicant_type', 'applicant', 'applicant_name', 'loan_product', 'loan_amount', 'status', 'creation'],
      order_by: 'creation desc'
    });
  }

  static async getLoanApplication(name: string) {
    return FrappeAPI.get<LoanApplication>('Loan Application', name);
  }

  static async createLoanApplication(data: LoanApplicationForm) {
    return FrappeAPI.create<LoanApplication>('Loan Application', data);
  }

  static async updateLoanApplication(name: string, data: Partial<LoanApplicationForm>) {
    return FrappeAPI.update<LoanApplication>('Loan Application', name, data);
  }

  // Loans
  static async getLoans() {
    return FrappeAPI.getList<Loan>('Loan', {
      fields: ['name', 'applicant_type', 'applicant', 'applicant_name', 'loan_amount', 'disbursed_amount', 'status', 'creation'],
      order_by: 'creation desc'
    });
  }

  static async getLoan(name: string) {
    return FrappeAPI.get<Loan>('Loan', name);
  }

  // Loan Disbursements
  static async getDisbursements() {
    return FrappeAPI.getList<LoanDisbursement>('Loan Disbursement', {
      fields: ['name', 'against_loan', 'disbursement_date', 'disbursed_amount', 'status'],
      order_by: 'disbursement_date desc'
    });
  }

  static async createDisbursement(data: Partial<LoanDisbursement>) {
    return FrappeAPI.create<LoanDisbursement>('Loan Disbursement', data);
  }

  // Loan Repayments
  static async getRepayments() {
    return FrappeAPI.getList<LoanRepayment>('Loan Repayment', {
      fields: ['name', 'against_loan', 'posting_date', 'amount_paid', 'status'],
      order_by: 'posting_date desc'
    });
  }

  static async createRepayment(data: LoanRepaymentForm) {
    return FrappeAPI.create<LoanRepayment>('Loan Repayment', data);
  }

  // Loan Products
  static async getLoanProducts() {
    return FrappeAPI.getList<LoanProduct>('Loan Product', {
      fields: ['name', 'product_name', 'maximum_loan_amount', 'rate_of_interest', 'status'],
      filters: { status: 'Active' }
    });
  }

  // Borrowers
  static async getBorrowers() {
    return FrappeAPI.getList<Borrower>('Borrower', {
      fields: ['name', 'customer_name', 'customer_type', 'mobile_no', 'email_id', 'status'],
      order_by: 'customer_name'
    });
  }

  static async getBorrower(name: string) {
    return FrappeAPI.get<Borrower>('Borrower', name);
  }

  // Dashboard Metrics
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Call custom method for dashboard data
      const data = await FrappeAPI.callMethod<DashboardMetrics>('lending.api.get_dashboard_metrics');
      return data;
    } catch (error) {
      // Fallback to mock data for development
      return {
        totalActiveLoans: 0,
        totalDisbursed: 0,
        pendingApplications: 0,
        overdueLoans: 0,
        totalPortfolioValue: 0,
        averageInterestRate: 0,
        monthlyDisbursements: [],
        portfolioByStatus: []
      };
    }
  }

  // Custom methods
  static async convertApplicationToLoan(applicationName: string) {
    return FrappeAPI.callMethod('lending.loan_management.doctype.loan_application.loan_application.create_loan', {
      loan_application: applicationName
    });
  }

  static async calculateRepaymentSchedule(loanName: string) {
    return FrappeAPI.callMethod('lending.loan_management.doctype.loan.loan.get_repayment_schedule', {
      loan: loanName
    });
  }
}