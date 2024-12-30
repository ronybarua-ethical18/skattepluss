import { SelectItem } from '@/components/ui/select';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import { trpc } from '@/utils/trpc';
import React from 'react';
const defaultCategories = [
  { title: 'Transport', value: 'transport' },
  { title: 'Meals', value: 'meals' },
  { title: 'Gas', value: 'gas' },
  { title: 'Unknown', value: 'unknown' },
];
const ExpenseCategoryCell = () => {
  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      keepPreviousData: true,
    }
  );
  const modifiedCategories = categories?.data
    ? categories?.data?.map((category) => {
        return {
          title: transformToUppercase(category.title),
          value: category.title.toLowerCase(),
        };
      })
    : [];

  const manipulatedCategories = Array.from(
    new Map(
      [...modifiedCategories, ...defaultCategories].map((cat) => [
        cat.value,
        cat,
      ])
    ).values()
  );

  return (
    <>
      {manipulatedCategories.map((_, i) => (
        <SelectItem key={i} value={_.value}>
          {_.title}
        </SelectItem>
      ))}
    </>
  );
};

export default ExpenseCategoryCell;
