'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { expense_categories } from '@/utils/dummy';
import { numberFormatter } from '@/utils/helpers/numberFormatter';

export default function WriteOffsTopSection({
  categoryWiseExpenses,
  expenseTypeWiseExpenses,
}: {
  categoryWiseExpenses: { category: string; totalItemByCategory: number }[];
  expenseTypeWiseExpenses: { expense_type: string; amount: number }[];
}) {
  const manipulateCategories = categoryWiseExpenses?.length
    ? expense_categories.map((category) => {
        const findExpenseCategory = categoryWiseExpenses.find(
          (item) =>
            item.category.toLowerCase() === category.category.toLowerCase()
        );
        return findExpenseCategory
          ? {
              ...category,
              totalItemByCategory: findExpenseCategory.totalItemByCategory,
            }
          : category;
      })
    : expense_categories;

  const sortedCategories = manipulateCategories
    .sort((a, b) => b.totalItemByCategory - a.totalItemByCategory)
    .slice(0, 8);
  const manipulateExpenseTypeTotal = expenseTypeWiseExpenses
    ?.filter((expense) => expense.expense_type === 'business')
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-4 p-6 bg-white flex flex-col justify-between rounded-2xl">
        <h3 className="text-xl text-[#101010] font-semibold">Write-Offs</h3>
        <p className="text-[32px] text-[#00104B] font-bold">
          {numberFormatter(manipulateExpenseTypeTotal || 0)}
        </p>
      </div>
      <div className="col-span-8">
        <div className="grid grid-cols-4 gap-2">
          {sortedCategories.map((category, index) => (
            <Card
              key={index}
              className="rounded-[16px] border border-[#EEF0F4] shadow-none"
            >
              <CardContent className="flex h-full items-center space-x-2 py-4 px-2">
                <Image
                  src={category.imageSrc}
                  alt={category.category}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-[#71717A] text-xs font-semibold">
                  {category.category}{' '}
                  <span>{`(${category.totalItemByCategory})`}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
