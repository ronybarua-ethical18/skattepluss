import { QuestionnaireItem, SubAnswer } from '@/redux/slices/questionnaire';
import { IQuestionnaire } from '@/server/db/interfaces/user';

const safeParseNumber = (value: string): number => {
  if (value === '') return 0;

  const parsedNum = parseFloat(value?.replace(/,/g, ''));
  return isNaN(parsedNum) ? 0 : parsedNum;
};

const healthAndFamilyExpenseCalculator = (
  healthAndFamilyPayload: QuestionnaireItem
) => {
  if (!healthAndFamilyPayload || !healthAndFamilyPayload.answers) return 0;

  return healthAndFamilyPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'Have children aged 11 years or younger':
        const documentedExpense = extractExpense('Documented Expense') || 0;
        const deductionOnNumber =
          extractExpense('How many children do you have under the age of 12?') >
          0
            ? 25000 +
              (extractExpense(
                'How many children do you have under the age of 12?'
              ) -
                1) *
                15000
            : 0;
        return total + Math.min(documentedExpense, deductionOnNumber);

      case 'I have children aged 12 or older with special care needs':
        const haveSpecial =
          value.find(
            (item: SubAnswer) =>
              'Do you have children with needs for special care' in item
          )?.['Do you have children with needs for special care'] === 'yes';
        const deductionOnSpecial12 = haveSpecial
          ? extractExpense('Documented care expenses')
          : 0;

        return total + deductionOnSpecial12;

      default:
        return total;
    }
  }, 0);
};

const workAndEducationExpenseCalculator = (
  workAndEducationPayload: QuestionnaireItem,
  questionnaires: IQuestionnaire[]
) => {
  if (!workAndEducationPayload || !workAndEducationPayload.answers) return 0;

  const initialAmount = questionnaires
    ?.find((item) => item.question === 'Work and Education')
    ?.answers.some((answer) =>
      Object.keys(answer).some((key) => key === 'Member of Trade Union')
    )
    ? 3850
    : 0;
  return workAndEducationPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'Moved for a new job':
        return total + extractExpense('Documented expenses');

      case 'I work as a fisherman':
        return total + Math.min(extractExpense('Fishing Income') * 0.3, 150000);

      case 'I work as a seafarer':
        return total + Math.min(extractExpense('Seafarer Income') * 0.3, 80000);

      case 'I went to school last year':
        return (
          total +
          extractExpense('Documented Education Expenses (if job-related)')
        );
      case 'Disputation of a PhD':
        return (
          total +
          extractExpense(
            'Documented Costs for Thesis Printing Travel and Defense Ceremony'
          )
        );
      case 'I Stay away from home overnight because of work':
        return total + extractExpense('Meals and accommodation cost');

      case 'Have expenses for road toll or ferry when travelling between your home and workplace':
        return total + extractExpense('Documented Expenses');
      case 'I am a foreign employee':
        return total + Math.min(extractExpense('Taxable Income') * 0.1, 40000);
      case 'Have a separate room in your house used only as your home office':
        const deductionOnSeperateRoom =
          (extractExpense('Room Area') / extractExpense('Home Area')) *
          extractExpense('Operating Cost');
        return total + deductionOnSeperateRoom;

      case 'The return distance between home and work is more than 37 kilometres':
        const totalDistance = extractExpense('Distance') * 2;
        const deductibleDistance = totalDistance - 37;
        const deductionOnDistance =
          deductibleDistance * 1.56 * extractExpense('Number of Workdays') >
          23100
            ? deductibleDistance * 1.56 * extractExpense('Number of Workdays') -
              23100
            : 0;
        console.log({ total, deductionOnDistance });

        return isNaN(total + deductionOnDistance)
          ? 0
          : total + deductionOnDistance;

      default:
        return total;
    }
  }, initialAmount);
};

const bankAndLoansExpenseCalculator = (
  bankAndLoansPayload: QuestionnaireItem
) => {
  if (!bankAndLoansPayload || !bankAndLoansPayload.answers) return 0;

  return bankAndLoansPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'Have a loan':
        const deduction = extractExpense('Total interest paid') * 0.22; // 22%
        return total + deduction;

      case 'Have refinanced a loan in the last year':
        const refinancedAmount = extractExpense('Refinancing cost') * 0.22;
        return total + refinancedAmount;

      case 'Have taken out a joint loan with someone':
        const own_share =
          extractExpense('Interest amount') *
          (extractExpense('Your ownership share') / 100);

        const deductionOnShare = own_share * 0.22;

        return total + deductionOnShare;
      case 'Have young people’s housing savings (BSU)':
        const deductionOnBSU = Math.min(
          extractExpense('This years savings') * 0.1,
          27500
        );

        return total + deductionOnBSU;
      case 'I have sold shares or securities at a loss':
        return total + extractExpense('Total loss') * 0.22;

      default:
        return total;
    }
  }, 0);
};

const hobbyOddjobsAndExtraIncomesExpenseCalculator = (
  hobbyOddjobsPayload: QuestionnaireItem
): number => {
  if (!hobbyOddjobsPayload?.answers) return 0;

  return hobbyOddjobsPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'I have a sole proprietorship':
        return total + extractExpense('proprietorship expense');

      case 'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale':
        return total + extractExpense('Documented expense');

      case 'I have received salary from odd jobs and services':
        const salary = extractExpense('Odd job income');
        return total + Math.min(salary, 6000);

      default:
        return total;
    }
  }, 0);
};

const housingAndPropertyExpenseCalculator = (
  housingAndPropertyPayload: QuestionnaireItem
) => {
  if (!housingAndPropertyPayload?.answers) return 0;

  return housingAndPropertyPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'Housing in a housing association housing company or jointly owned property':
        return total + extractExpense('Documented cost');

      case 'I have rented out a residential property or a holiday home':
        return total + extractExpense('Expense');

      case 'Sold a residential property or holiday home profit or loss':
        const isCapitalGain =
          value.find(
            (item: SubAnswer) =>
              'Was the property your primary residence for at least 12 of the last 24 months' in
              item
          )?.[
            'Was the property your primary residence for at least 12 of the last 24 months'
          ] === 'yes';
        const CapitatGainOrLoss = isCapitalGain
          ? extractExpense('Capital gain or loss')
          : 0;

        return total + CapitatGainOrLoss;

      default:
        return total;
    }
  }, 0);
};

const giftsOrDonationsExpenseCalculator = (
  giftsOrDonationsPayload: QuestionnaireItem
) => {
  if (!giftsOrDonationsPayload || !giftsOrDonationsPayload.answers) return 0;

  const donationAmount = safeParseNumber(
    giftsOrDonationsPayload.answers[0][
      'Gifts to voluntary organisations'
    ]?.[0]?.['Donation Amount']
  );

  if (donationAmount >= 500) {
    return Math.min(donationAmount, 25000);
  }

  return 0;
};

const foreignIncomeExpenseCalculator = (
  foreignIncomePayload: QuestionnaireItem
): number => {
  if (!foreignIncomePayload?.answers?.length) return 0;

  const foreignIncomeEntry =
    foreignIncomePayload.answers[0][
      'Have income or wealth in another country than Norway and pay tax in the other country'
    ];

  if (!foreignIncomeEntry) return 0;

  const extractValue = (field: string) =>
    safeParseNumber(
      foreignIncomeEntry.find(
        (item: Record<string, string>) => field in item
      )?.[field] || ''
    ) || 0;

  const foreignIncome = extractValue('Foreign income');
  if (foreignIncome === 0) return 0;

  const foreignTaxAmount = extractValue('Foreign tax amount');
  const norwayTaxRate = extractValue('Norway tax rate on this income');

  return foreignTaxAmount * (norwayTaxRate / 100);
};

export const savingExpenseCalculator = (
  questionnaires: IQuestionnaire[] | undefined
) => {
  if (!questionnaires || !Array.isArray(questionnaires)) {
    return {
      workAndEducationExpenseAmount: 0,
      healthAndFamilyExpenseAmount: 0,
      bankAndLoansExpenseAmount: 0,
      hobbyOddjobsAndExtraIncomesExpenseAmount: 0,
      housingAndPropertyExpenseAmount: 0,
      giftsOrDonationsExpenseAmount: 0,
      foreignIncomeExpenseAmount: 0,
    };
  }

  const questionnaireMap = questionnaires.reduce<
    Record<string, QuestionnaireItem | null>
  >((acc, item) => {
    if (item && typeof item === 'object' && 'question' in item) {
      acc[item.question] = item;
    }
    return acc;
  }, {});

  const {
    'Health and Family': healthAndFamilyPayload = null,
    'Work and Education': workAndEducationPayload = null,
    'Bank and Loans': bankAndLoansPayload = null,
    'Hobby, Odd Jobs, and Extra Incomes': hobbyOddjobsPayload = null,
    'Housing and Property': housingAndPropertyPayload = null,
    'Gifts or Donations': giftsOrDonationsPayload = null,
    'Foreign Income': foreignIncomePayload = null,
  } = questionnaireMap;

  const healthAndFamilyExpenseAmount = (() => {
    try {
      return healthAndFamilyPayload
        ? healthAndFamilyExpenseCalculator(healthAndFamilyPayload)
        : 0;
    } catch (error) {
      console.error('Error calculating Health and Family expense:', error);
      return 0;
    }
  })();

  const workAndEducationExpenseAmount = (() => {
    try {
      return workAndEducationPayload
        ? workAndEducationExpenseCalculator(
            workAndEducationPayload,
            questionnaires
          )
        : 0;
    } catch (error) {
      console.error('Error calculating Work and Education expense:', error);
      return null;
    }
  })();

  const bankAndLoansExpenseAmount = (() => {
    try {
      return bankAndLoansPayload
        ? bankAndLoansExpenseCalculator(bankAndLoansPayload)
        : 0;
    } catch (error) {
      console.error('Error calculating Bank and Loans expense:', error);
      return 0;
    }
  })();

  const hobbyOddjobsAndExtraIncomesExpenseAmount = (() => {
    try {
      return hobbyOddjobsPayload
        ? hobbyOddjobsAndExtraIncomesExpenseCalculator(hobbyOddjobsPayload)
        : 0;
    } catch (error) {
      console.error('Error calculating Hobby and Odd Jobs expense:', error);
      return 0;
    }
  })();

  const housingAndPropertyExpenseAmount = (() => {
    try {
      return housingAndPropertyPayload
        ? housingAndPropertyExpenseCalculator(housingAndPropertyPayload)
        : 0;
    } catch (error) {
      console.error('Error calculating Housing and Property expense:', error);
      return 0;
    }
  })();

  const giftsOrDonationsExpenseAmount = (() => {
    try {
      return giftsOrDonationsPayload
        ? giftsOrDonationsExpenseCalculator(giftsOrDonationsPayload)
        : 0;
    } catch (error) {
      console.error('Error calculating Gifts or Donations expense:', error);
      return 0;
    }
  })();

  const foreignIncomeExpenseAmount = (() => {
    try {
      return foreignIncomePayload
        ? foreignIncomeExpenseCalculator(foreignIncomePayload)
        : 0;
    } catch (error) {
      console.error('Error calculating Foreign Income expense:', error);
      return 0;
    }
  })();

  return {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  };
};
