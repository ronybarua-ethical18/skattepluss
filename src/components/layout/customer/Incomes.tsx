'use client';

import React, { useState } from 'react';

import ProtectedLayout from '../ProtectedLayout';
import IncomeCardsSection from './components/incomes/IncomeCardsSection';
import IncomeOverviewSection from './components/incomes/IncomeOverviewSection';

const CustomerIncomes: React.FC = () => {
  const [filterString, setFilterString] = useState<string>('');

  return (
    <ProtectedLayout>
      <IncomeCardsSection filterString={filterString} />
      <IncomeOverviewSection
        filterString={filterString}
        setFilterString={setFilterString}
      />
    </ProtectedLayout>
  );
};

export default CustomerIncomes;
