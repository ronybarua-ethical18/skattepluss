import { categories } from '../dummy';

interface ExpenseItem {
  category: string;
  totalItemByCategory: number;
  amount: number;
}

export const manipulatedCategories = (expenses: {
  categoryWiseExpenses: ExpenseItem[];
}) => {
  return categories?.map((category) => {
    const find = expenses?.categoryWiseExpenses?.find(
      (item: { category: string }) =>
        item.category.toLowerCase() === category.label.toLowerCase()
    );
    const unknownCategory = expenses?.categoryWiseExpenses?.find(
      (item: { category: string }) =>
        item.category === 'unknown' && category.label === 'More'
    );

    if (find) {
      return {
        label: category.label,
        amount: find.totalItemByCategory, // Use totalItemByCategory for amount
        image: category.image,
      };
    }

    if (unknownCategory) {
      return {
        label: `More (${unknownCategory?.totalItemByCategory})`, // Use totalItemByCategory for label
        amount: `NOK ${unknownCategory.amount}`, // Show currency amount for "More"
        image: category.image,
      };
    }

    return category;
  });
};
