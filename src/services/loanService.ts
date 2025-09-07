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
  LoanRepaymentForm,
  LoanApplicationsSummaryResponse,
  LoansSummaryResponse,
  RecentActivity
} from '@/types/loan';

export class LoanService {
  // Loan Applications
  static async getLoanApplications() {
    return FrappeAPI.getList<LoanApplication>('Loan Application', {
      fields: [
        'name',
        'applicant_type',
        'applicant',
        'applicant_name',
        'loan_product',
        'loan_amount',
        'rate_of_interest',
        'repayment_periods',
        'repayment_schedule_type',
        'status',
        'creation'
      ],
      order_by: 'creation desc'
    });
  }

  static async getLoanApplication(name: string) {
    return FrappeAPI.get<LoanApplication>('Loan Application', name);
  }

  static async createLoanApplication(data: any) {
    try {
      // Use the safe API method that handles validation and errors
      return await FrappeAPI.callMethod('lending.api.create_loan_application_safe', {
        application_data: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw error;
    }
  }

  static async updateLoanApplication(name: string, data: Partial<LoanApplicationForm>) {
    return FrappeAPI.update<LoanApplication>('Loan Application', name, data);
  }

  // Get employees for loan applications
  static async getEmployees() {
    try {
      return await FrappeAPI.getList<any>('Employee', {
        fields: ['name', 'employee_name'],
        limit: 100
      });
    } catch (error) {
      console.error('Failed to load employees:', error);
      return [];
    }
  }

  // Get companies
  static async getCompanies() {
    try {
      return await FrappeAPI.getList<any>('Company', {
        fields: ['name', 'company_name'],
        limit: 50
      });
    } catch (error) {
      console.error('Failed to load companies:', error);
      return [];
    }
  }

  static async getLoanApplicationsSummary(): Promise<LoanApplicationsSummaryResponse> {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loan_applications_summary');
    } catch (error) {
      console.error('Failed to load loan applications summary:', error);
      return { applications: [], total_count: 0 };
    }
  }

  // Loans
  static async getLoans() {
    return FrappeAPI.getList<Loan>('Loan', {
      fields: [
        'name',
        'applicant_type',
        'applicant',
        'applicant_name',
        'loan_product',
        'loan_amount',
        'disbursed_amount',
        'rate_of_interest',
        'repayment_periods',
        'repayment_schedule_type',
        'status',
        'creation'
      ],
      order_by: 'creation desc'
    });
  }

  static async getLoan(name: string) {
    return FrappeAPI.get<Loan>('Loan', name);
  }

  static async getLoansSummary(): Promise<LoansSummaryResponse> {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loans_summary');
    } catch (error) {
      console.error('Failed to load loans summary:', error);
      return { loans: [], total_count: 0 };
    }
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
      fields: ['name', 'product_name', 'maximum_loan_amount', 'rate_of_interest']
    });
  }

  // Borrowers
  static async getBorrowers() {
    return FrappeAPI.getList<Borrower>('Borrower', {
      fields: ['name', 'full_name', 'borrower_type', 'mobile_number', 'email_id'],
      order_by: 'full_name'
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
      console.error('Failed to load dashboard metrics:', error);
      // Fallback to mock data for development
      return {
        totalActiveLoans: 156,
        totalDisbursed: 2450000,
        pendingApplications: 23,
        overdueLoans: 8,
        totalPortfolioValue: 5800000,
        averageInterestRate: 8.5,
        monthlyDisbursements: [
          { name: 'Jan', value: 180000 },
          { name: 'Feb', value: 220000 },
          { name: 'Mar', value: 190000 },
          { name: 'Apr', value: 280000 },
          { name: 'May', value: 350000 },
          { name: 'Jun', value: 420000 }
        ],
        portfolioByStatus: [
          { name: 'Active', value: 3200000, count: 89 },
          { name: 'Pending', value: 1800000, count: 34 },
          { name: 'Closed', value: 800000, count: 23 }
        ]
      };
    }
  }

  // Recent Activities
  static async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      return await FrappeAPI.callMethod('lending.api.get_recent_activities');
    } catch (error) {
      console.error('Failed to load recent activities:', error);
      return [];
    }
  }

  // Disbursements
  static async getDisbursementsSummary() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_disbursements_summary');
    } catch (error) {
      console.error('Failed to load disbursements summary:', error);
      return { disbursements: [], total_count: 0, pending_count: 0, pending_amount: 0 };
    }
  }

  static async createDisbursement(data: any) {
    try {
      return await FrappeAPI.callMethod('lending.api.create_loan_disbursement', data);
    } catch (error) {
      console.error('Failed to create disbursement:', error);
      throw error;
    }
  }

  // Repayments
  static async getRepaymentsSummary() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_repayments_summary');
    } catch (error) {
      console.error('Failed to load repayments summary:', error);
      return { repayments: [], total_count: 0, overdue_count: 0 };
    }
  }

  static async createRepayment(data: any) {
    try {
      return await FrappeAPI.callMethod('lending.api.create_loan_repayment', data);
    } catch (error) {
      console.error('Failed to create repayment:', error);
      throw error;
    }
  }

  // Borrowers
  static async getBorrowersSummary() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_borrowers_summary');
    } catch (error) {
      console.error('Failed to load borrowers summary:', error);
      return { borrowers: [], total_count: 0, active_count: 0 };
    }
  }

  // Securities
  static async getSecuritiesSummary() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_securities_summary');
    } catch (error) {
      console.error('Failed to load securities summary:', error);
      return { securities: [], active_pledges: [], total_securities: 0, active_pledges_count: 0 };
    }
  }

  // Loan Details
  static async getLoanDetails(loanId: string) {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loan_details', { loan_id: loanId });
    } catch (error) {
      console.error('Failed to load loan details:', error);
      return { loan: null, repayment_schedule: [], disbursements: [], repayments: [] };
    }
  }

  // Loan Products
  static async getAllLoanProducts() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loan_products');
    } catch (error) {
      console.error('Failed to load loan products:', error);
      return [];
    }
  }

  // Additional API methods for new pages
  static async getRepaymentSchedule(loanId: string) {
    try {
      return await FrappeAPI.callMethod('lending.api.get_repayment_schedule', { loan_id: loanId });
    } catch (error) {
      console.error('Failed to load repayment schedule:', error);
      return { schedule: [], total_count: 0 };
    }
  }

  static async getOverdueLoans() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_overdue_loans');
    } catch (error) {
      console.error('Failed to load overdue loans:', error);
      return [];
    }
  }

  static async getPortfolioAnalytics() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_portfolio_analytics');
    } catch (error) {
      console.error('Failed to load portfolio analytics:', error);
      return {
        portfolio_by_product: [],
        monthly_trends: [],
        collection_efficiency: 0,
        collection_stats: {}
      };
    }
  }

  static async getSecurityValuationSummary() {
    try {
      return await FrappeAPI.callMethod('lending.api.get_security_valuation_summary');
    } catch (error) {
      console.error('Failed to load security valuation summary:', error);
      return {
        security_coverage: [],
        security_distribution: [],
        total_secured_loans: 0
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

  // Reports
  static async getLoanRepaymentReport(filters = {}) {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loan_repayment_report', { filters: JSON.stringify(filters) });
    } catch (error) {
      console.error('Failed to load loan repayment report:', error);
      return { columns: [], data: [], total_count: 0 };
    }
  }

  static async getLoanSecurityStatusReport(filters = {}) {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loan_security_status_report', { filters: JSON.stringify(filters) });
    } catch (error) {
      console.error('Failed to load loan security status report:', error);
      return { columns: [], data: [], total_count: 0 };
    }
  }

  static async getLoanInterestReport(filters = {}) {
    try {
      return await FrappeAPI.callMethod('lending.api.get_loan_interest_report', { filters: JSON.stringify(filters) });
    } catch (error) {
      console.error('Failed to load loan interest report:', error);
      return { columns: [], data: [], total_count: 0 };
    }
  }

  // Borrower management
  static async createBorrower(data: any) {
    try {
      return await FrappeAPI.callMethod('lending.api.create_borrower', { borrower_data: JSON.stringify(data) });
    } catch (error) {
      console.error('Failed to create borrower:', error);
      throw error;
    }
  }

  // Loan management
  static async createLoan(data: any) {
    return FrappeAPI.create<any>('Loan', data);
  }

  static async createRepayment(data: any) {
    return FrappeAPI.create<any>('Loan Repayment', data);
  }

  static async updateBorrower(borrowerId: string, data: any) {
    return FrappeAPI.update<any>('Borrower', borrowerId, data);
  }

  static async updateLoanApplication(applicationId: string, data: any) {
    return FrappeAPI.update<any>('Loan Application', applicationId, data);
  }

  static async updateLoan(loanId: string, data: any) {
    return FrappeAPI.update<any>('Loan', loanId, data);
  }

  static async updateRepayment(repaymentId: string, data: any) {
    return FrappeAPI.update<any>('Loan Repayment', repaymentId, data);
  }

  // Print methods
  static async printLoanRepaymentSchedule(loanId: string) {
    return FrappeAPI.callMethod('lending.api.print_loan_repayment_schedule', {
      loan_id: loanId
    });
  }

  static async printLoanOfferLetter(loanId: string) {
    return FrappeAPI.callMethod('lending.api.print_loan_offer_letter', {
      loan_id: loanId
    });
  }
}