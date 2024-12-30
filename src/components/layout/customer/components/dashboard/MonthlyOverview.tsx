'use client';

import { Card, CardContent } from '@/components/ui/card';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import React from 'react';
import { NoResultsPlaceholder } from '../../../../NoResultsPlaceholder';

const MonthlyOverview = () => {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });

  const writeOffs = expenses?.data?.categoryWiseExpenses;

  return (
    <Card className="col-span-3 p-6 border border-[#EEF0F4] shadow-none rounded-2xl">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div className="flex justify-between">
          <h4 className="text-sm text-[#627A97] font-semibold mb-3">
            Write offs Overview
          </h4>
        </div>
        <ul className="h-[252px] max-h-[252px] overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          {writeOffs && writeOffs.length > 0 ? (
            writeOffs.map(
              ({
                category,
                amount,
                totalItemByCategory,
              }: {
                category: string;
                totalItemByCategory: number;
                amount: number;
              }) => (
                <div className="mt-3" key={category}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-xs">{category}</h4>
                      <p className="text-gray-500 font-normal text-xs">
                        {totalItemByCategory + ' ' + 'items'}
                      </p>
                    </div>
                    <p className="text-xs font-medium mb-4">
                      NOK {numberFormatter(Number(amount.toFixed()))}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <NoResultsPlaceholder message="Could not find anything" />
          )}
        </ul>
        <Link
          href="/customer/write-offs"
          className="text-center font-medium mt-2 text-sm text-[#5B52F9]"
        >
          View more
        </Link>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
