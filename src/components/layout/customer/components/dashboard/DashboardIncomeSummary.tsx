'use client';

import React from 'react';
import DashboardTotalIncomeChart from './DashboardTotalIncomeChart';
import { trpc } from '@/utils/trpc';
import IncomeSummaryChart from './IncomeSummaryChart';
import YearlyIncomeGraph from './YearlyIncomeGraph';

function DashboardIncomeSummary() {
  const { data: incomeAnalytics } =
    trpc.incomes.getCategoryAndIncomeTypeWiseIncomes.useQuery({
      income_type: '',
    });
  return (
    <div>
      <h1 className="text-gray-600 font-bold text-xs uppercase mt-5">
        Income Overview
      </h1>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <div className="grid grid-cols-12 gap-2">
            <DashboardTotalIncomeChart
              incomeAnalytics={incomeAnalytics ? incomeAnalytics : {}}
            />
            <IncomeSummaryChart
              incomes={incomeAnalytics?.data?.categoryWiseIncomes}
            />
          </div>
        </div>
        <YearlyIncomeGraph />
      </div>
    </div>
  );
}

export default DashboardIncomeSummary;
