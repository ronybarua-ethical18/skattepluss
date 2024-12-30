'use client';
import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { YearlyExpenseTableColumns } from './YearlyExpenseTableColumns';
import { trpc } from '@/utils/trpc';

type RecentExpenseTableItem = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
};
type RecentExpenseTableItems = {
  data: RecentExpenseTableItem[];
};

const RecentExpenseTable = () => {
  const { data: expensesResponse } = trpc.expenses.getExpenses.useQuery(
    {
      page: 1,
      limit: 5,
    },
    {
      keepPreviousData: true,
    }
  ) as { data?: RecentExpenseTableItems };
  console.log({ expensesResponse });

  return (
    <div className="col-span-7 space-y-6 p-6 rounded-2xl bg-white">
      <div>
        <h4 className="text-sm text-[#101010] font-semibold">
          Recent Expenses Overview
        </h4>
      </div>
      <div className="">
        <SharedDataTable
          className="max-h-[325px]"
          columns={YearlyExpenseTableColumns()}
          data={expensesResponse?.data || []}
        />
      </div>
    </div>
  );
};

export default RecentExpenseTable;
