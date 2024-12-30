import { trpc } from '@/utils/trpc';

type Query = {
  category_for: string | undefined;
};

export const useManipulatedCategories = (query: Query) => {
  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      ...query,
      page: 1,
      limit: 50,
    },
    {
      enabled: !!query?.category_for, // Only fetch if category_for is provided
      keepPreviousData: true,
    }
  );

  const manipulatedCategories = categories?.data
    ? categories.data.map((category) => ({
        title: category.title,
        value: category.title,
      }))
    : [];

  return {
    manipulatedCategories,
    categories,
  };
};
