type ExpensesProps = {
  category: string;
  totalItemByCategory?: number;
  amount: number | string;
};

interface AnalysisResult {
  topCategory: {
    name: string;
    percentage: number;
  };
  utilities: {
    percentage: number;
  };
}

export function percentageCalculatorForDeductibleExpenses(
  expenses?: ExpensesProps[]
): AnalysisResult {
  // Handle null or undefined input
  if (!expenses || expenses.length === 0) {
    return {
      topCategory: {
        name: 'N/A',
        percentage: 0,
      },
      utilities: {
        percentage: 0,
      },
    };
  }

  // Safely convert amounts and filter out invalid entries
  const processedExpenses = expenses
    .map((expense) => ({
      ...expense,
      amount:
        typeof expense.amount === 'string'
          ? parseFloat(expense.amount)
          : expense.amount,
    }))
    .filter(
      (expense) =>
        !isNaN(expense.amount) &&
        typeof expense.category === 'string' &&
        expense.category.trim() !== ''
    );

  // Handle case where no valid expenses remain
  if (processedExpenses.length === 0) {
    return {
      topCategory: {
        name: 'N/A',
        percentage: 0,
      },
      utilities: {
        percentage: 0,
      },
    };
  }

  // Calculate total amount across all categories
  const totalAmount = processedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Sort expenses by amount in descending order
  const sortedExpenses = processedExpenses.sort(
    (a, b) => (b.amount as number) - (a.amount as number)
  );

  // Find the top category (highest amount)
  const topCategory = sortedExpenses[0];

  // Calculate top category percentage
  const topCategoryPercentage =
    ((topCategory.amount as number) / totalAmount) * 100;

  // Calculate utility percentage (all categories except top)
  const utilityExpenses = sortedExpenses
    .slice(1)
    .reduce((sum, expense) => sum + (expense.amount as number), 0);

  const utilitiesPercentage = (utilityExpenses / totalAmount) * 100;

  return {
    topCategory: {
      name: topCategory.category,
      percentage: Number(topCategoryPercentage.toFixed(2)),
    },
    utilities: {
      percentage: Number(utilitiesPercentage.toFixed(2)),
    },
  };
}
