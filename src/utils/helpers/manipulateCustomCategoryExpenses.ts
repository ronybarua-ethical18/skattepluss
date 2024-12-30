type DBCategories = {
  id: number;
  category: string;
  amount: number;
  reference_category: string;
};

export type ReferencedCategory = {
  title: string;
  reference_category: string;
  amount: number;
  original_amount: number;
};

export const manipulateCustomCategoryExpenses = (
  referenceCategories: ReferencedCategory[],
  categoryAnalytics: DBCategories[]
) => {
  return referenceCategories?.map((category) => {
    const matchDbCategory = categoryAnalytics?.find(
      (dbCatgory: DBCategories) => dbCatgory.category === category.title
    );

    if (matchDbCategory) {
      if (
        category.reference_category &&
        ['Furniture and Equipment', 'Computer Hardware'].includes(
          category.reference_category
        )
      ) {
        return {
          name: category.title,
          amount:
            matchDbCategory.amount > 15000 ? 15000 : matchDbCategory.amount,
          original_amount: matchDbCategory.amount,
          reference_category: category.reference_category,
        };
      }
      return {
        name: category.title,
        amount: matchDbCategory.amount,
        original_amount: matchDbCategory.amount,
        reference_category: category.reference_category,
      };
    }
    return category;
  });
};
