'use client';

import React, { useState } from 'react';

import ProtectedLayout from '../ProtectedLayout';
import ExpenseTopSection from './components/expenses/ExpenseTopSection';
import ExpenseOverviewSection from './components/expenses/ExpenseOverviewSection';

const CustomerExpenses: React.FC = () => {
  const [filterString, setFilterString] = useState<string>('');

  return (
    <ProtectedLayout>
      <ExpenseTopSection filterString={filterString} />
      <ExpenseOverviewSection
        filterString={filterString}
        setFilterString={setFilterString}
      />
    </ProtectedLayout>
  );
};

export default CustomerExpenses;
