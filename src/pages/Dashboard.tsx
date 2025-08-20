import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, DollarSign, TrendingUp, Users } from 'lucide-react';
import { LoanService } from '@/services/loanService';
import { DashboardMetrics as DashboardMetricsType, RecentActivity as RecentActivityType } from '@/types/loan';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetricsType>({
    totalActiveLoans: 0,
    totalDisbursed: 0,
    pendingApplications: 0,
    overdueLoans: 0,
    totalPortfolioValue: 0,
    averageInterestRate: 0,
    monthlyDisbursements: [],
    portfolioByStatus: []
  });
  const [activities, setActivities] = useState<RecentActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadRecentActivities();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await LoanService.getDashboardMetrics();
      setMetrics(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Use mock data for development
      setMetrics({
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
          { name: 'Active', value: 65 },
          { name: 'Fully Disbursed', value: 25 },
          { name: 'Partially Disbursed', value: 8 },
          { name: 'Closed', value: 2 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      const activitiesData = await LoanService.getRecentActivities();
      setActivities(activitiesData);
    } catch (error) {
      console.error('Failed to load recent activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'New Application',
      description: 'Create a new loan application',
      icon: FileText,
      action: () => navigate('/applications'),
      variant: 'financial' as const
    },
    {
      title: 'Quick Disbursement',
      description: 'Process loan disbursement',
      icon: DollarSign,
      action: () => navigate('/disbursements'),
      variant: 'success' as const
    },
    {
      title: 'Record Payment',
      description: 'Add loan repayment',
      icon: TrendingUp,
      action: () => navigate('/repayments'),
      variant: 'default' as const
    },
    {
      title: 'Add Borrower',
      description: 'Register new borrower',
      icon: Users,
      action: () => navigate('/borrowers'),
      variant: 'secondary' as const
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your lending overview</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your lending overview</p>
          </div>
          <Button variant="financial" className="gap-2">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </div>

        {/* Metrics */}
        <DashboardMetrics {...metrics} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant={action.variant}
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={action.action}
                >
                  <action.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm opacity-80">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivity activities={activities} loading={activitiesLoading} />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Disbursements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chart component will be implemented</p>
                <p className="text-sm">Monthly disbursement trends</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chart component will be implemented</p>
                <p className="text-sm">Loan portfolio breakdown</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}