'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CircularProgressChart from './CircularProgressChart';
import { numberFormatter } from '@/utils/helpers/numberFormatter';

// Define interfaces for type safety
interface IncomeEntry {
  income_type: string;
  amount: number;
}

interface IncomeAnalyticsData {
  incomeTypeWiseIncomes: IncomeEntry[];
}

interface IncomeAnalytics {
  data?: IncomeAnalyticsData;
}

const DashboardTotalIncomeChart = ({
  incomeAnalytics,
}: {
  incomeAnalytics: IncomeAnalytics;
}) => {
  const incomeTypeWiseAnalytics =
    incomeAnalytics?.data?.incomeTypeWiseIncomes || [];

  const businessTotal =
    incomeTypeWiseAnalytics.find((income) => income.income_type === 'business')
      ?.amount || 0;

  const personalTotal =
    incomeTypeWiseAnalytics.find((income) => income.income_type === 'personal')
      ?.amount || 0;

  const unknownTotal =
    incomeTypeWiseAnalytics.find((income) => income.income_type === 'unknown')
      ?.amount || 0;

  const totalIncome = Number(
    (businessTotal + personalTotal + unknownTotal).toFixed(2)
  );

  console.log('income analytics', incomeAnalytics);

  return (
    <Card className="col-span-6 py-6 px-[21px] border border-[#EEF0F4] shadow-none rounded-2xl mt-2">
      <CardContent className="p-0 relative">
        <Badge className="bg-[#F0EFFE] px-1 absolute top-0 right-0  hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium">
          This year
        </Badge>
        <div className="">
          <h4 className="text-sm  text-[#627A97] font-semibold">
            Total Income
          </h4>
          <p className="text-[28px] text-[#00104B] font-bold">
            NOK {numberFormatter(totalIncome)}
          </p>
        </div>

        <div className="mt-4 space-y-2 ">
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                Business
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Incomes from
              </span>
            </div>
            <CircularProgressChart
              series={[Math.round((businessTotal / (totalIncome || 1)) * 100)]}
            />
          </div>
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                Personal
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Incomes from
              </span>
            </div>
            <CircularProgressChart
              color="#F99BAB"
              trackBg="#F99BAB5E"
              series={[Math.round((personalTotal / (totalIncome || 1)) * 100)]}
            />
          </div>
          {unknownTotal > 0 && (
            <div className="flex justify-between items-center px-4 bg-[#F0EFFE] rounded-2xl">
              <div className="flex flex-col">
                <span className="text-sm text-[#101010] font-semibold">
                  Uncategorized
                </span>
                <span className="text-sm text-[#627A97] font-medium">
                  Incomes from
                </span>
              </div>
              <CircularProgressChart
                color="#F99BAB"
                trackBg="#F99BAB5E"
                series={[Math.round((unknownTotal / (totalIncome || 1)) * 100)]}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTotalIncomeChart;
