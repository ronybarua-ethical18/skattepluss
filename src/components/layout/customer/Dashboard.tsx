import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import DashboardSummarySection from './components/dashboard/DashboardSummarySection';
import DashboardIncomeSummary from './components/dashboard/DashboardIncomeSummary';

const CustomerDashboard: React.FC = () => {
  return (
    <ProtectedLayout>
      <DashboardSummarySection />
      <DashboardIncomeSummary />
      {/* <DashboardOverviewSection /> */}
    </ProtectedLayout>
  );
};

export default CustomerDashboard;
