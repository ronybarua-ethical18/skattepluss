import { protectedProcedure } from '@/server/middlewares/with-auth';
import httpStatus from 'http-status';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import ExpenseModel from '@/server/db/models/expense';
import { ApiError } from '@/lib/exceptions';
import { expenseValidation } from './expenses.validation';
import { ExpenseHelpers } from '@/server/helpers/expense';
import {
  ExpenseType,
  IExpense,
  IExpenseUpdate,
} from '@/server/db/interfaces/expense';
import { errorHandler } from '@/server/middlewares/error-handler';
import RuleModel from '@/server/db/models/rules';
import mongoose from 'mongoose';
import { parseFilterString } from '@/utils/helpers/parseFilterString';

export const expenseRouter = router({
  getExpenses: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        searchTerm: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit, searchTerm, filterString } = input;
        const skip = (page - 1) * limit;

        // Base query to filter expenses by user
        const query: Record<string, unknown> = { user: loggedUser?.id };

        // Parse and add filters from filterString
        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        // If a search term is provided, add a condition to match fields
        if (searchTerm) {
          query.$or = [
            { description: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
            { expense_type: { $regex: searchTerm, $options: 'i' } },
          ];
        }

        const total = await ExpenseModel.countDocuments(query);
        const expenses = await ExpenseModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        return {
          status: 200,
          message: 'Expenses fetched successfully',
          data: expenses,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof expenses>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getCategoryAndExpenseTypeWiseExpenses: protectedProcedure
    .input(
      z.object({
        expense_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { expense_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (expense_type) {
          query.expense_type = ExpenseType.business;
        }

        // Parse and add filters from filterString
        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const expenses =
          await ExpenseHelpers.getCategoryAndExpenseTypeAnalytics(query);

        return {
          status: 200,
          message:
            'Category-wise and expense_type-wise expenses fetched successfully',
          data: expenses[0],
        } as ApiResponse<(typeof expenses)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessAndPersonalExpenseAnalytics: protectedProcedure
    .input(
      z.object({
        expense_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { expense_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (expense_type) {
          query.expense_type = ExpenseType.business;
        }

        // Parse and add filters from filterString
        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const expenses =
          await ExpenseHelpers.getBusinessAndPersonalExpenseAnalytics(query);

        return {
          status: 200,
          message: 'Analytics for business an personal expense are fetched.',
          data: expenses[0],
        } as ApiResponse<(typeof expenses)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessAndPersonalExpenseYearly: protectedProcedure
    .input(
      z.object({
        expense_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { expense_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (expense_type) {
          query.expense_type = ExpenseType.business;
        }

        // Parse and add filters from filterString
        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const expenses =
          await ExpenseHelpers.getBusinessAndPersonalExpenseAnalyticsYearly(
            query
          );

        return {
          status: 200,
          message: 'Analytics for business an personal expense are fetched.',
          data: expenses[0],
        } as ApiResponse<(typeof expenses)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  getWriteOffs: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const { page, limit, searchTerm } = input;
        const skip = (page - 1) * limit;

        // Base query to filter expenses by user
        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
          expense_type: ExpenseType.business,
        };

        if (searchTerm) {
          query.$or = [{ category: { $regex: searchTerm, $options: 'i' } }];
        }
        const total =
          await ExpenseHelpers.getTotalUniqueExpenseCategories(loggedUser);

        const totalUniqueCategories = total[0]?.uniqueCategories;
        const expenses = await ExpenseHelpers.getWriteOffSummary(
          skip,
          limit,
          query
        );

        return {
          status: 200,
          message: 'Write off summary fetched successfully',
          data: expenses,
          pagination: {
            total: totalUniqueCategories,
            page,
            limit,
            totalPages: Math.ceil(totalUniqueCategories / limit),
          },
        } as unknown as ApiResponse<typeof totalUniqueCategories>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getUnknownExpensesWithMatchedRules: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit } = input;

        const total = await ExpenseModel.countDocuments({
          user: loggedUser?.id,
          expense_type: ExpenseType.unknown,
          category: ExpenseType.unknown,
        });

        const rules = await RuleModel.find({ user: loggedUser?.id });

        // Use Promise.all to ensure all async operations complete
        const expensesWithRules = await ExpenseHelpers.getExpensesWithRules(
          rules,
          loggedUser
        );

        const expensesWithAllRules = {
          expensesWithRules,
          rules,
        };

        return {
          status: 200,
          message: 'Expenses fetched with matched rules',
          data: expensesWithAllRules as object,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof expensesWithRules>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  createExpense: protectedProcedure
    .input(expenseValidation.createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await ExpenseHelpers.createExpenseRecord(
          input as IExpense,
          loggedUser.id
        );

        return {
          status: 201,
          message: 'Expense created successfully',
          data: expense,
        } as ApiResponse<typeof expense>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  createBulkExpenses: protectedProcedure
    .input(expenseValidation.createBulkExpenseSchema)
    .mutation(async ({ ctx, input: expenses }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        console.log('expenses payload', expenses);

        const createdExpenses = await Promise.all(
          expenses.map(async (singleExpense) => {
            return await ExpenseHelpers.createExpenseFromBulkInput(
              singleExpense,
              loggedUser.id
            );
          })
        );

        return {
          status: 201,
          message: 'Expenses created successfully',
          data: createdExpenses,
        } as ApiResponse<typeof createdExpenses>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  updateBulkExpense: protectedProcedure
    .input(expenseValidation.updateBulkExpenseSchema)

    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { expenses } = input;

        // Update all specified expenses for the logged-in user
        const updatedExpenses = await Promise.all(
          expenses.map(async (expense) => {
            return await ExpenseModel.findByIdAndUpdate(
              { _id: expense?._id, user: loggedUser?.id },
              { $set: expense.expenseUpdatePayload },
              { new: true }
            ).lean();
          })
        );

        if (!updatedExpenses) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            'Some expenses were not found or not accessible.'
          );
        }

        return {
          status: 200,
          message: 'Expenses updated successfully',
          data: updatedExpenses,
        } as ApiResponse<typeof updatedExpenses>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
      }
    }),
  deleteExpense: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { _id } }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await ExpenseHelpers.deleteExpenseRecord(
          _id,
          loggedUser.id
        );

        return {
          status: 200,
          message: 'Expense deleted successfully',
          data: expense,
        } as ApiResponse<typeof expense>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
      }
    }),
  updateExpense: protectedProcedure
    .input(expenseValidation.createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await ExpenseHelpers.updateExpenseRecord(
          input as IExpenseUpdate,
          loggedUser.id
        );

        return {
          status: 200,
          message: 'Expense updated successfully',
          data: expense,
        } as ApiResponse<typeof expense>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
