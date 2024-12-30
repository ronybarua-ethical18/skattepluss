type ChartItems = {
  date: string;
  totalAmount: number;
  totalItems: number;
  dayName: string;
};

export const chartItemsManipulation = (
  title: string,
  weekdays: string[],
  businessChartExpenses: ChartItems[] | undefined,
  personalChartExpense: ChartItems[] | undefined
) => {
  // Select the appropriate chart data based on the title
  const chartExpenses =
    title.toLowerCase() === 'business'
      ? businessChartExpenses
      : personalChartExpense;

  // Map abbreviations to full day names
  const dayAbbreviationToFull: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  // Map full day names to their corresponding amounts
  const dayAmountMap: Record<string, number> = {};
  chartExpenses?.forEach((item) => {
    const fullDayName = dayAbbreviationToFull[item.dayName.toLowerCase()];
    if (fullDayName) {
      // Ensure the amount is formatted to one decimal place
      dayAmountMap[fullDayName] = Number(item.totalAmount.toFixed(1));
    }
  });

  // Create the chart items for the weekdays in the correct order
  const chartItemsByExpenseType = weekdays.map((day) => {
    const amount = dayAmountMap[day] || 0;
    // Ensure the amount is formatted to one decimal place
    return Number(amount.toFixed(1));
  });

  return {
    manipulateWeekDays: weekdays,
    chartItemsByExpenseType: chartItemsByExpenseType || [],
  };
};
