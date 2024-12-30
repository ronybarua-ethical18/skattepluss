type DBCategories = {
  id: number;
  category: string;
  amount: number;
};

export type PredefinedCategories = {
  id: number;
  name: string;
  items: {
    name: string;
    amount: number;
    original_amount: number;
    reference_category?: string;
  }[];
  total_amount: number;
  total_original_amount: number;
};

export type CustomCategory = {
  name: string;
  amount: number;
  original_amount: number;
  reference_category?: string;
};

export const finalCalculation = (
  dbCategories: DBCategories[],
  predefinedCategories: PredefinedCategories[],
  customCategories: CustomCategory[]
) => {
  return predefinedCategories.map((predefined: PredefinedCategories) => {
    const predefinedCategories = predefined.items.map(
      (item: { name: string; amount: number; original_amount: number }) => {
        const matchedWithDbCategory = dbCategories?.find(
          (dbCategory: DBCategories) => dbCategory.category === item.name
        );
        if (matchedWithDbCategory) {
          if (
            ['Furniture and Equipment', 'Computer Hardware'].includes(
              matchedWithDbCategory.category
            )
          ) {
            return {
              ...item,
              amount:
                matchedWithDbCategory.amount > 15000
                  ? 15000
                  : matchedWithDbCategory.amount,
              original_amount: matchedWithDbCategory.amount,
            };
          }
          return {
            ...item,
            amount: matchedWithDbCategory.amount,
            original_amount: matchedWithDbCategory.amount,
          };
        }
        return item;
      }
    );
    const total_amount = Number(
      predefinedCategories
        .reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0)
        .toFixed(2)
    );

    const total_original_amount = predefinedCategories.reduce(
      (acc: number, curr: { original_amount: number }) =>
        acc + curr.original_amount,
      0
    );

    if (
      predefined.name === 'Custom Category Expenses' &&
      customCategories?.length > 0
    ) {
      const total_amount = Number(
        customCategories
          .reduce(
            (acc: number, curr: { amount: number }) => acc + curr.amount,
            0
          )
          .toFixed(2)
      );

      const total_original_amount = customCategories.reduce(
        (acc: number, curr: { original_amount: number }) =>
          acc + curr.original_amount,
        0
      );
      return {
        title: 'Custom Category Expenses',
        predefinedCategories: customCategories,
        total_amount: total_amount || 0,
        total_original_amount,
      };
    }

    return {
      title: predefined.name,
      predefinedCategories,
      total_amount,
      total_original_amount,
    };
  });
};
