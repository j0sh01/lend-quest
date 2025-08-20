import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, FileText, AlertTriangle, CreditCard } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function MetricCard({ title, value, change, trend, icon: Icon, className = '' }: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className={`transition-all duration-200 hover:shadow-medium ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && TrendIcon && (
          <div className={`flex items-center mt-1 text-sm ${getTrendColor()}`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            <span>{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardMetricsProps {
  totalActiveLoans: number;
  totalDisbursed: number;
  pendingApplications: number;
  overdueLoans: number;
  totalPortfolioValue: number;
  averageInterestRate: number;
}

export function DashboardMetrics({
  totalActiveLoans,
  totalDisbursed,
  pendingApplications,
  overdueLoans,
  totalPortfolioValue,
  averageInterestRate
}: DashboardMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        title="Active Loans"
        value={totalActiveLoans}
        change="+12%"
        trend="up"
        icon={CreditCard}
        className="hover:scale-105"
      />
      
      <MetricCard
        title="Total Disbursed"
        value={formatCurrency(totalDisbursed)}
        change="+8.5%"
        trend="up"
        icon={DollarSign}
        className="hover:scale-105"
      />
      
      <MetricCard
        title="Pending Applications"
        value={pendingApplications}
        change="-3%"
        trend="down"
        icon={FileText}
        className="hover:scale-105"
      />
      
      <MetricCard
        title="Overdue Loans"
        value={overdueLoans}
        change="+2%"
        trend="up"
        icon={AlertTriangle}
        className={`hover:scale-105 ${overdueLoans > 0 ? 'border-warning/20 bg-warning-light/10' : ''}`}
      />
      
      <MetricCard
        title="Portfolio Value"
        value={formatCurrency(totalPortfolioValue)}
        change="+15.2%"
        trend="up"
        icon={TrendingUp}
        className="hover:scale-105"
      />
      
      <MetricCard
        title="Avg Interest Rate"
        value={formatPercentage(averageInterestRate)}
        trend="neutral"
        icon={TrendingDown}
        className="hover:scale-105"
      />
    </div>
  );
}