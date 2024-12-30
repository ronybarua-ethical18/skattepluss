import RuleModel from '@/server/db/models/rules';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ruleValidation } from './rules.validation';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import CategoryModel from '@/server/db/models/category';
import httpStatus from 'http-status';
import { ApiError, AuthError } from '@/lib/exceptions';
import { errorHandler } from '@/server/middlewares/error-handler';

export const rulesRouter = router({
  getRules: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        searchTerm: z.string().optional(),
        rule_for: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const { page, limit, searchTerm, rule_for } = input;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = { user: loggedUser?.id };

        // If a search term is provided, add a condition to match fields
        if (searchTerm) {
          query.$or = [
            { description_contains: { $regex: searchTerm, $options: 'i' } },
            { category_title: { $regex: searchTerm, $options: 'i' } },
          ];
        }
        if (rule_for) {
          query.rule_for = rule_for;
        }

        const total = await RuleModel.countDocuments(query);
        const totalExpenseRules = await RuleModel.countDocuments({
          rule_for: 'expense',
          user: loggedUser?.id,
        });
        const totalIncomeRules = await RuleModel.countDocuments({
          rule_for: 'income',
          user: loggedUser?.id,
        });
        const rules = await RuleModel.find(query).skip(skip).limit(limit);

        return {
          status: 200,
          message: 'Rules fetched successfully',
          data: rules,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
          totals: { totalExpenseRules, totalIncomeRules },
        } as ApiResponse<typeof rules>;
      } catch (error) {
        console.log(error);
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong to fetch rules'
        );
      }
    }),

  createRule: protectedProcedure
    .input(ruleValidation.ruleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email || !sessionUser?.id) {
          throw new AuthError('You must be logged in to create this rule.');
        }

        const rule = await RuleModel.findOne({
          user: sessionUser.id,
          description_contains: input.description_contains,
          category_title: input.category,
          expense_type: input.expense_type,
          rule_for: input.rule_for,
        });

        if (rule) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'The rule is already created.'
          );
        }
        const categoryQuery = { title: input.category };

        const category = await CategoryModel.findOneAndUpdate(
          {
            ...categoryQuery,
            creator_id: sessionUser.id,
          },
          {
            $setOnInsert: { creator_id: sessionUser.id, title: input.category },
          },
          {
            new: true,
            upsert: true,
          }
        );

        const createRule = await RuleModel.create({
          ...input,
          user: sessionUser?.id,
          category: category?._id,
          category_title: category?.title,
        });

        return {
          message: 'New Rule created successfully',
          status: 200,
          data: createRule,
        } as ApiResponse<typeof createRule>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.BAD_REQUEST, message);
      }
    }),
  updateRule: protectedProcedure
    .input(ruleValidation.updateRuleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { _id, ...restPayload } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser?.email) {
          throw new Error('Authentication required');
        }

        const categoryQuery = {
          title: input.category,
          // creator_id: sessionUser.id,
        };

        const category = await CategoryModel.findOne(categoryQuery);

        console.log('update rule payload from backend', input);
        console.log('category find during rule update', category);

        const updateRule = await RuleModel.findByIdAndUpdate(
          { _id },
          {
            ...restPayload,
            category: category._id,
            category_title: category.title,
          },
          { new: true }
        );

        return {
          message: 'Rule is updated successfully',
          status: 200,
          category: updateRule,
        };
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  deleteRule: protectedProcedure
    .input(ruleValidation.deleteRuleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('delete rule input', input);
        const { _id } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser?.email) {
          throw new Error('Authentication required');
        }

        const rule = await RuleModel.findByIdAndDelete(_id);

        return {
          message: 'Rule deleted successfully',
          status: 200,
          data: rule,
        } as ApiResponse<typeof rule>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  updateManyRule: protectedProcedure.query(async () => {
    try {
      // Update all categories to set category_for to "expense"
      await RuleModel.updateMany({}, { $set: { rule_for: 'expense' } });

      // Fetch the updated categories
      const categories = await RuleModel.find({});

      return {
        status: 200,
        message: 'Categories updated successfully',
        data: categories,
      } as ApiResponse<typeof categories>;
    } catch (error: unknown) {
      const { message } = errorHandler(error);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  }),
});
