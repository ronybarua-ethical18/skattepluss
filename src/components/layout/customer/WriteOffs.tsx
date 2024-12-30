'use client';

import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import QuestionnairesReviewSection from './components/write-offs/QuestionnairesReviewSection';
import WriteOffsTopSection from './components/write-offs/WriteOffsTopSection';
import WriteOffsTableSection from './components/write-offs/WriteOffsTableSection';
import { trpc } from '@/utils/trpc';

export default function CustomerWriteOffs() {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });

  return (
    <ProtectedLayout>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-9">
          <WriteOffsTopSection
            categoryWiseExpenses={expenses?.data?.categoryWiseExpenses}
            expenseTypeWiseExpenses={expenses?.data?.expenseTypeWiseExpenses}
          />
          <WriteOffsTableSection />
        </div>
        <QuestionnairesReviewSection />
      </div>
    </ProtectedLayout>
  );
}
