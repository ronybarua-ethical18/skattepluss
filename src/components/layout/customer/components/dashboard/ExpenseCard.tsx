import { Card, CardTitle } from '@/components/ui/card';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import Icon1 from '../../../../../../public/images/dashboard/expense-card/icon1.svg';
import Icon2 from '../../../../../../public/images/dashboard/expense-card/icon2.svg';
import Icon3 from '../../../../../../public/images/dashboard/expense-card/icon3.svg';
import Icon4 from '../../../../../../public/images/dashboard/expense-card/icon4.svg';
import Icon5 from '../../../../../../public/images/dashboard/expense-card/icon5.svg';
import Icon6 from '../../../../../../public/images/dashboard/expense-card/icon6.svg';

export const expenses = (personalAmount: number) => {
  return [
    {
      title: 'Personal Spending (non deductable)',
      amount: personalAmount,
      image: Icon1,
    },
    { title: 'Travel & Meals', amount: 10250, image: Icon2 },
    { title: 'Office Expenses', amount: 10250, image: Icon3 },
    { title: 'Car Expenses', amount: 0, image: Icon4 },
    { title: 'Taxes/Licenses', amount: 0, image: Icon5 },
    { title: 'Legal/Professional Services', amount: 0, image: Icon6 },
  ];
};

interface ExpenseCardProps {
  index: number;
  expense: {
    title: string;
    amount: number;
    image: StaticImageData;
  };
}
const ExpenseCard = ({ expense, index }: ExpenseCardProps) => {
  return (
    <Card className="p-6 flex items-center justify-between border border-[#EEF0F4] shadow-none rounded-2xl">
      <div className="space-y-1">
        <CardTitle className="text-sm text-[#71717A] font-semibold">
          {expense?.title}
        </CardTitle>
        <p className="text-[20px] text-[#00104B] font-bold">
          NOK {numberFormatter(expense?.amount)}{' '}
          {/* <span className="text-xs text-[#00B386] text-bold">+55%</span> */}
        </p>
      </div>
      <Image
        src={expense.image}
        alt={`icon${index + 1}`}
        height={51}
        width={52}
      />
    </Card>
  );
};

export default ExpenseCard;
