import { StaticImageData } from 'next/image';

type CategoryProps = {
  category: string;
  totalItemByCategory?: number;
  amount: number | string;
};

interface Expense {
  title: string;
  amount: number;
  image: StaticImageData;
}

export function updateExpenses(
  originalExpenses: Expense[] = [],
  dbData: CategoryProps[] = []
) {
  // Early return if either input is invalid
  if (!originalExpenses?.length || !dbData?.length) {
    return originalExpenses;
  }

  // Create a copy of the original expenses array to avoid mutating the original
  const updatedExpenses = [...originalExpenses];

  // Dynamically create titleMap based on database records
  const titleMap = dbData.reduce(
    (map: Record<string, string>, item: CategoryProps, index: number) => {
      map[item.category] = `${item.category} ${getUniqueQualifier(index + 1)}`;
      return map;
    },
    {}
  );

  // Update the remaining items
  for (let i = 1; i < updatedExpenses.length; i++) {
    // Safely access dbData, fallback to undefined if not available
    const dbItem = dbData[i - 1];

    if (dbItem) {
      updatedExpenses[i] = {
        ...updatedExpenses[i],
        title: titleMap[dbItem.category],
        amount: Number(dbItem.amount),
      };
    }
  }

  return updatedExpenses;
}

// Helper function to add a unique qualifier to titles
function getUniqueQualifier(index: number): string {
  const qualifiers = ['Total', 'Items', 'Spending', 'Count'];
  return qualifiers[(index - 1) % qualifiers.length];
}
