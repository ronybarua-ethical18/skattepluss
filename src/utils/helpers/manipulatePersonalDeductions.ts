import { savingExpenseCalculator } from './savingExpenseCalculator';
import { IQuestionnaire } from '@/server/db/interfaces/user';

export const manipulatePersonalDeductions = (
  questionnaires: IQuestionnaire[]
) => {
  const {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  } = savingExpenseCalculator(questionnaires);
  return [
    {
      title: 'Health and Family',
      total_amount: healthAndFamilyExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Bank and Loans',
      total_amount: bankAndLoansExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Work and Education',
      total_amount: workAndEducationExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Housing and Property',
      total_amount: housingAndPropertyExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Gifts/Donations',
      total_amount: giftsOrDonationsExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Hobby, Odd Jobs, and Extra Incomes',
      total_amount: hobbyOddjobsAndExtraIncomesExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Foreign Income',
      total_amount: foreignIncomeExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
  ];
};
