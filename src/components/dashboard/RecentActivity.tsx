import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, DollarSign, FileText, User } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'application' | 'disbursement' | 'repayment' | 'approval';
  title: string;
  description: string;
  amount?: number;
  time: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  userName?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'application',
    title: 'New Loan Application',
    description: 'John Doe applied for Personal Loan',
    amount: 25000,
    time: '2 hours ago',
    status: 'pending',
    userName: 'John Doe'
  },
  {
    id: '2',
    type: 'disbursement',
    title: 'Loan Disbursement',
    description: 'Business loan disbursed to ABC Corp',
    amount: 150000,
    time: '4 hours ago',
    status: 'completed',
    userName: 'ABC Corp'
  },
  {
    id: '3',
    type: 'repayment',
    title: 'Loan Repayment',
    description: 'Monthly payment received from Sarah Wilson',
    amount: 2500,
    time: '6 hours ago',
    status: 'completed',
    userName: 'Sarah Wilson'
  },
  {
    id: '4',
    type: 'approval',
    title: 'Loan Approved',
    description: 'Auto loan application approved',
    amount: 35000,
    time: '1 day ago',
    status: 'approved',
    userName: 'Mike Johnson'
  },
  {
    id: '5',
    type: 'application',
    title: 'Application Submitted',
    description: 'Home loan application for review',
    amount: 300000,
    time: '2 days ago',
    status: 'pending',
    userName: 'Emily Chen'
  }
];

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'application': return FileText;
    case 'disbursement': return DollarSign;
    case 'repayment': return DollarSign;
    case 'approval': return FileText;
    default: return Clock;
  }
}

function getStatusVariant(status: ActivityItem['status']) {
  switch (status) {
    case 'pending': return 'pending';
    case 'completed': return 'success';
    case 'approved': return 'approved';
    case 'rejected': return 'rejected';
    default: return 'default';
  }
}

export function RecentActivity() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <Badge variant={getStatusVariant(activity.status)} className="ml-2">
                      {activity.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                      {activity.userName && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{activity.userName}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(activity.amount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}