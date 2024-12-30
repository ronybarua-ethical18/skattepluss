'use client';

import React from 'react';
import MonthlyOverview from './MonthlyOverview';
import YearlyExpenseTable from './RecentExpenseTable';
import { trpc } from '@/utils/trpc';

const DashboardOverviewSection = () => {
  const { data: expensesResponse } = trpc.expenses.getExpenses.useQuery(
    {
      page: 1,
      limit: 5,
    },
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="grid grid-cols-12 gap-2 mt-2">
      <YearlyExpenseTable data={expensesResponse?.data || []} />
      <MonthlyOverview />
    </div>
  );
};

export default DashboardOverviewSection;
