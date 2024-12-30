import React from 'react';
import ExpenseStats from './ExpenseStats';
import { numberFormatter } from '@/utils/helpers/numberFormatter';

type ExpenseStatsProps = {
  type: string;
  percentage?: number;
  month?: string;
  amount: number;
  filterString?: string;
};

const ExpenseStatsByType: React.FC<ExpenseStatsProps> = ({
  amount,
  type,
  filterString,
}) => {
  return (
    <div className="bg-white rounded-xl px-4 pt-4 relative">
      <h1 className="text-xl font-semibold">{type} Expense</h1>

      <div className="flex justify-between items-center mt-7">
        <h1 className="text-xl font-bold mt-6 absolute left-4 bottom-5">
          {`NOK ${numberFormatter(amount)}`}
        </h1>
        <ExpenseStats title={type} filterString={filterString} />
      </div>
    </div>
  );
};

export default ExpenseStatsByType;
