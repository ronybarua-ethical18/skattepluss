'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import { categories } from '@/utils/dummy';
import { manipulatedCategories } from '@/utils/helpers/categoryManipulation';

// Updated Category interface to handle different image types
interface Category {
  label: string;
  amount: number;
  image?: string | StaticImageData;
}

export default function CategoryCard() {
  // Add explicit type for the query result
  const { data: expensesData } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
    });

  // Type-safe category manipulation
  const manipulateCategories: Category[] = React.useMemo(() => {
    const rawCategories = expensesData?.data?.categoryWiseExpenses
      ? manipulatedCategories(expensesData.data)
      : categories;

    // Ensure amount is a number and map to Category type
    return rawCategories.map((category) => ({
      ...category,
      amount: Number(category.amount) || 0,
      image: category.image, // Keep original image type
    }));
  }, [expensesData]);

  // Safely filter and sort categories
  const sortedCategories: Category[] = React.useMemo(
    () =>
      manipulateCategories
        .filter((category) => !isNaN(category.amount))
        .sort((a, b) => b.amount - a.amount),
    [manipulateCategories]
  );

  // Safely handle empty categories array
  const highestCategory = sortedCategories[0] || null;

  const remainingCategories = sortedCategories.slice(1);

  const topCategories = remainingCategories.slice(0, 7);

  const othersAmount = remainingCategories
    .slice(7)
    .reduce((sum, category) => sum + category.amount, 0);

  // Create display categories with default values
  const displayCategories: Category[] = [
    ...topCategories,
    ...(othersAmount > 0
      ? [
          {
            label: 'Others',
            amount: othersAmount,
            image: '/path/to/default-icon.svg', // Fallback to string path
          },
        ]
      : [
          {
            label: 'Others',
            amount: 0,
            image: '/path/to/default-icon.svg', // Fallback to string path
          },
        ]),
  ];

  // Render null if no categories exist
  if (!highestCategory && displayCategories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {/* Card for the highest category */}
      {highestCategory && (
        <Card
          style={{ gridRow: 'span 2' }}
          className="col-span-1 rounded-[16px] border border-[#EEF0F4] shadow-none min-h-[100px] max-h-[208px]"
        >
          <CardContent className="flex h-full items-center space-x-4 p-4">
            {highestCategory.image && (
              <Image
                src={highestCategory.image}
                alt={highestCategory.label}
                width={100}
                height={98}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className={cn('text-l font-bold')}>
                {highestCategory.amount.toLocaleString()}
              </h3>
              <p className="text-[#71717A] font-inter text-[12px] font-semibold leading-[20px]">
                {highestCategory.label}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid for the other categories */}
      <div className="col-span-5 grid grid-cols-4 gap-2">
        {displayCategories.map((category, index) => (
          <Card
            key={index}
            className={cn(
              'min-h-[100px] rounded-[16px] border border-[#EEF0F4] shadow-none flex items-center',
              category.label === 'Others' ? 'justify-center' : ''
            )}
          >
            <CardContent
              className={cn(
                'flex h-full items-center space-x-4 p-4',
                category.label === 'Others' ? 'justify-center text-center' : ''
              )}
            >
              {category.label !== 'Others' && category.image && (
                <Image
                  src={category.image}
                  alt={category.label}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className={category.label === 'Others' ? 'text-center' : ''}>
                <h3
                  className={cn(
                    'text-l font-bold text-center',
                    category.label === 'Others' ? 'text-center' : ''
                  )}
                >
                  {category.amount.toLocaleString()}
                </h3>
                <p className="text-[#71717A] font-inter text-[12px] font-semibold leading-[20px] text-center items-center">
                  {category.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
