type ExpenseCategory = {
  title: string;
  threshold: number;
};

const expenseCategories: ExpenseCategory[] = [
  { title: 'Furniture and Equipment', threshold: 15_000 },
  { title: 'Computer Hardware', threshold: 13_000 },
];

export function limitExpense(title: string, amount: number): number {
  const category = expenseCategories.find((cat) => cat.title === title);
  return category ? Math.min(amount, category.threshold) : amount;
}
