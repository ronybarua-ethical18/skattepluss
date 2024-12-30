'use client';

import React, { useEffect, useState } from 'react';

import IncomeStatsByType from './IncomeStatsByType';
import IncomeType from './IncomeType';
import PlusIcon from '../../../../../../public/images/expenses/plus.png';
import { income_categories } from '@/utils/dummy';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

interface CategoryIncome {
  category: string;
  totalItemByCategory: number;
  amount: number;
}

interface IncomeType {
  income_type: string;
  totalItemByIncomeType: number;
  amount: number;
}
interface CategoryCard {
  id: number;
  imageSrc: StaticImageData;
  category: string;
  totalItemByCategory: number;
  amount: number;
}

type IFilterProps = {
  filterString: string;
};

const IncomeCardsSection = ({ filterString }: IFilterProps) => {
  const [categoryCards, setCategoryCards] =
    useState<CategoryCard[]>(income_categories);
  const [incomeStats, setIncomeStats] = useState({
    personal: 0,
    business: 0,
  });

  const { data: incomes } =
    trpc.incomes.getCategoryAndIncomeTypeWiseIncomes.useQuery({
      income_type: '',
      filterString,
    });

  const { data: user } = useSession();
  useEffect(() => {
    if (!incomes?.data) return;

    const { categoryWiseIncomes, incomeTypeWiseIncomes } = incomes.data;

    if (categoryWiseIncomes) {
      const updatedCategoryCards = income_categories.map((card) => {
        const matchingIncome = categoryWiseIncomes.find(
          (income: CategoryIncome) =>
            income.category.toLowerCase() === card.category.toLowerCase()
        );

        return matchingIncome
          ? {
              ...card,
              totalItemByCategory: matchingIncome.totalItemByCategory,
              amount: matchingIncome.amount,
            }
          : card;
      });

      updatedCategoryCards.sort((a, b) => b.amount - a.amount);

      setCategoryCards(updatedCategoryCards);
    }

    if (incomeTypeWiseIncomes) {
      const personal = incomeTypeWiseIncomes.find(
        (exp: IncomeType) => exp.income_type === 'personal'
      );
      const business = incomeTypeWiseIncomes.find(
        (exp: IncomeType) => exp.income_type === 'business'
      );

      setIncomeStats({
        personal: personal?.amount ?? 0,
        business: business?.amount ?? 0,
      });
    }
  }, [incomes?.data]);

  console.log('aggreated incomes', incomes);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <IncomeStatsByType
          type="Business"
          amount={incomeStats.business}
          filterString={filterString}
        />
        <IncomeStatsByType
          type="Personal"
          amount={incomeStats.personal}
          filterString={filterString}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categoryCards.slice(0, 7).map((income, i) => (
          <IncomeType
            key={i}
            imageSrc={income.imageSrc}
            amount={income.amount}
            type={income.category}
            quantity={income.totalItemByCategory}
          />
        ))}
        <Link
          href={`/${user?.user.role}/categories`}
          className="text-white flex items-center justify-center bg-[#5B52F9] p-4 rounded-xl font-bold cursor-pointer"
        >
          <Image src={PlusIcon} alt="Plus icon" className="mr-3" />
          More
        </Link>
      </div>
    </div>
  );
};

export default IncomeCardsSection;
