import { ApiError } from '@/lib/exceptions';
import { IncomeType, IIncome, IIncomeUpdate } from '../db/interfaces/income';
import CategoryModel from '../db/models/category';
import IncomeModel from '../db/models/income';
import RuleModel from '../db/models/rules';
import httpStatus from 'http-status';
import { errorHandler } from '../middlewares/error-handler';
import { IRule } from '../db/interfaces/rules';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

async function findMatchingRule(description: string, userId: string) {
  try {
    const normalizedDescription = description
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s]/g, '');

    const rules = await RuleModel.find({
      user: userId,
      rule_for: 'income',
    });

    const matchingRule = rules.find((rule) => {
      const normalizedRule = rule.description_contains
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s]/g, '');

      return normalizedDescription.includes(normalizedRule);
    });

    return matchingRule || null;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

async function createIncomeRecord(input: IIncome, userId: string) {
  try {
    const category = await CategoryModel.findOneAndUpdate(
      {
        title: input.category,
        creator_id: userId,
      },
      {
        $setOnInsert: {
          title: input.category,
          creator_id: userId,
        },
      },
      { upsert: true, new: true }
    );

    // Upsert rule
    const updatedRule = await RuleModel.findOneAndUpdate(
      {
        description_contains: input.description,
        user: userId,
      },
      {
        $setOnInsert: {
          income_type: input.income_type,
          category_title: input.category,
          category: category?._id,
        },
      },
      { upsert: true, new: true }
    );

    return await IncomeModel.create({
      ...input,
      user: userId,
      income_type:
        updatedRule?.income_type || input.income_type || IncomeType.unknown,
      category: category?.title || input.category || 'unknown',
      rule: updatedRule?._id,
    });
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

async function createIncomeFromBulkInput(
  input: { description: string; amount: number },
  userId: string
) {
  try {
    const rule = await findMatchingRule(input.description, userId);

    const incomeData = {
      ...input,
      user: userId,
      income_type:
        rule?.income_type || rule?.expense_type || IncomeType.unknown,
      category: rule?.category_title || 'unknown',
      rule: rule?._id,
    };

    return await IncomeModel.findOneAndUpdate(
      { description: input.description, user: userId },
      incomeData,
      { upsert: true, new: true }
    );
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

const getIncomesWithRules = async (rules: IRule[], loggedUser: JwtPayload) => {
  try {
    const incomesWithRules = (
      await Promise.all(
        rules.map(async (rule) => {
          const escapedDescription = rule.description_contains.replace(
            /[-/\\^$*+?.()|[\]{}]/g,
            '\\$&'
          );
          const incomes = await IncomeModel.find({
            user: loggedUser?.id,
            income_type: IncomeType.unknown,
            category: IncomeType.unknown,
            description: {
              $regex: escapedDescription,
              $options: 'i',
            },
          })
            .sort({ createdAt: -1 })
            .select('amount description category income_type')
            .lean();

          return incomes.length > 0
            ? {
                rule: rule.description_contains,
                incomePayload: {
                  rule: rule._id,
                  category: rule.category_title,
                  income_type: rule.expense_type,
                },
                incomes,
              }
            : null;
        })
      )
    ).filter((result) => result !== null);
    return incomesWithRules;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const getCategoryAndIncomeTypeAnalytics = async (
  query: Record<string, unknown>
) => {
  try {
    return await IncomeModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          categoryWiseIncomes: [
            {
              $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                category: '$_id',
                totalItemByCategory: '$totalItems',
                amount: '$totalAmount',
                _id: 0,
              },
            },
          ],
          incomeTypeWiseIncomes: [
            {
              $group: {
                _id: '$income_type',
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                income_type: '$_id',
                totalItemByIncomeType: '$totalItems',
                amount: '$totalAmount',
                _id: 0,
              },
            },
          ],
        },
      },
    ]);
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

interface incomeAnalytics {
  date?: string;
  totalAmount: number;
  totalItems: number;
  dayName?: string;
  month?: string;
}

interface incomeAnalyticsResult {
  businessIncomeAnalytics: incomeAnalytics[];
  personalIncomeAnalytics: incomeAnalytics[];
}

const getBusinessAndPersonalIncomeAnalytics = async (
  query: Record<string, unknown>
): Promise<incomeAnalyticsResult[]> => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const dateArray: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateArray.push(date.toISOString().split('T')[0]);
    }

    const result = await IncomeModel.aggregate<incomeAnalyticsResult>([
      {
        $match: {
          ...query,
          transaction_date: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
        },
      },
      {
        $facet: {
          businessincomeAnalytics: [
            {
              $match: {
                income_type: 'business',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                date: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { date: 1 },
            },
            {
              $addFields: {
                date: { $ifNull: ['$date', dateArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                date: { $in: dateArray },
              },
            },
            {
              $limit: 7,
            },
          ],
          // Personal income Analytics grouped by day
          personalincomeAnalytics: [
            {
              $match: {
                income_type: 'personal',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                date: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { date: 1 },
            },
            {
              $addFields: {
                date: { $ifNull: ['$date', dateArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                date: { $in: dateArray },
              },
            },
            {
              $limit: 7,
            },
          ],
        },
      },
    ]);

    return result.map((analytics) => ({
      businessIncomeAnalytics: ensureSevenDaysCoverage(
        analytics.businessIncomeAnalytics,
        dateArray
      ),
      personalIncomeAnalytics: ensureSevenDaysCoverage(
        analytics.personalIncomeAnalytics,
        dateArray
      ),
    }));
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const getBusinessAndPersonalIncomeAnalyticsYearly = async (
  query: Record<string, unknown>
): Promise<incomeAnalyticsResult[]> => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 11);

    const monthArray: string[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const yearMonth = date.toISOString().split('T')[0].slice(0, 7);
      monthArray.push(yearMonth);
    }

    const result = await IncomeModel.aggregate<incomeAnalyticsResult>([
      {
        $match: {
          ...query,
          transaction_date: {
            $gte: twelveMonthsAgo,
            $lte: today,
          },
        },
      },
      {
        $facet: {
          businessIncomeAnalytics: [
            {
              $match: {
                income_type: 'business',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                month: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { month: 1 },
            },
            {
              $addFields: {
                month: { $ifNull: ['$month', monthArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                month: { $in: monthArray },
              },
            },
          ],
          personalIncomeAnalytics: [
            {
              $match: {
                income_type: 'personal',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                month: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { month: 1 },
            },
            {
              $addFields: {
                month: { $ifNull: ['$month', monthArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                month: { $in: monthArray },
              },
            },
          ],
        },
      },
    ]);

    return result.map((analytics) => ({
      businessIncomeAnalytics: ensureTwelveMonthsCoverage(
        analytics.businessIncomeAnalytics,
        monthArray
      ),
      personalIncomeAnalytics: ensureTwelveMonthsCoverage(
        analytics.personalIncomeAnalytics,
        monthArray
      ),
    }));
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const ensureTwelveMonthsCoverage = (
  analytics: incomeAnalytics[],
  monthArray: string[]
): incomeAnalytics[] => {
  const analyticsMap = new Map(analytics.map((item) => [item.month, item]));
  return monthArray.map(
    (month) =>
      analyticsMap.get(month) || { month, totalAmount: 0, totalItems: 0 }
  );
};

const ensureSevenDaysCoverage = (
  analytics: incomeAnalytics[],
  dateArray: string[]
): incomeAnalytics[] => {
  const analyticsMap = new Map(analytics.map((item) => [item.date, item]));

  return dateArray.map((date) => {
    const dayName = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
    });

    return analyticsMap.get(date)
      ? {
          ...analyticsMap.get(date)!,
          dayName,
        }
      : {
          date,
          dayName,
          totalAmount: 0,
          totalItems: 0,
        };
  });
};

const getTotalUniqueincomeCategories = async (loggedUser: JwtPayload) => {
  try {
    return await IncomeModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
          income_type: IncomeType.business,
        },
      },
      {
        $group: {
          _id: '$category',
        },
      },
      {
        $count: 'uniqueCategories',
      },
    ]);
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};
const deleteIncomeRecord = async (incomeId: string, userId: string) => {
  try {
    const income = await IncomeModel.findOne({
      _id: incomeId,
      user: userId,
    });
    if (!income) {
      throw new Error('Income not found or unauthorized');
    }

    const deletedIncome = await IncomeModel.findByIdAndDelete(incomeId);

    if (!deletedIncome) {
      throw new Error('Failed to delete income');
    }

    return deletedIncome;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
};
const updateIncomeRecord = async (input: IIncomeUpdate, userId: string) => {
  try {
    const { id, ...updateData } = input;
    const income = await IncomeModel.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!income) {
      throw new Error(
        'income not found or you do not have permission to update'
      );
    }
    return income;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
};

export const IncomeHelpers = {
  updateIncomeRecord,
  createIncomeRecord,
  createIncomeFromBulkInput,
  findMatchingRule,
  getIncomesWithRules,
  getCategoryAndIncomeTypeAnalytics,
  deleteIncomeRecord,
  getTotalUniqueincomeCategories,
  getBusinessAndPersonalIncomeAnalytics,
  getBusinessAndPersonalIncomeAnalyticsYearly,
};
