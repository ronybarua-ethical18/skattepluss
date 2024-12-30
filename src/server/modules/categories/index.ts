import httpStatus from 'http-status';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { categoryValidation } from './categories.validation';
import Category from '@/server/db/models/category';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import { errorHandler } from '@/server/middlewares/error-handler';
import { ApiError } from '@/lib/exceptions';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';

export const categoryRouter = router({
  getCategories: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(100),
        searchTerm: z.string().optional(),
        category_for: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit, searchTerm, category_for } = input;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {
          $and: [
            {
              $or: [{ creator_id: loggedUser?.id }, { created_by: 'SYSTEM' }],
            },
          ],
        };

        // If a search term is provided, add a condition to match fields
        if (searchTerm) {
          query.title = { $regex: searchTerm, $options: 'i' };
        }

        if (category_for) {
          query.category_for = category_for;
        }

        const total = await Category.countDocuments(query);
        const totalExpenseCategories = await Category.countDocuments({
          category_for: 'expense',
          $or: [{ creator_id: loggedUser?.id }, { created_by: 'SYSTEM' }],
        });
        const totalIncomeCategories = await Category.countDocuments({
          category_for: 'income',
          $or: [{ creator_id: loggedUser?.id }, { created_by: 'SYSTEM' }],
        });
        const categories = await Category.find(query)
          .sort({ title: 1 })
          .skip(skip)
          .limit(limit);

        return {
          status: 200,
          message: 'Categories fetched successfully',
          data: categories,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
          totals: {
            totalExpenseCategories,
            totalIncomeCategories,
          },
        } as ApiResponse<typeof categories>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  deleteCategory: protectedProcedure
    .input(categoryValidation.deleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { _id } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser?.email) {
          throw new Error('Authentication required');
        }

        const category = await Category.findById(_id);
        if (!category) {
          throw new Error('Category not found');
        }

        if (category.creator_id.toString() !== sessionUser.id) {
          throw new Error('Unauthorized to delete this category');
        }

        await Category.findByIdAndDelete(_id);

        return {
          message: 'Category deleted successfully',
          status: 200,
          data: _id,
        } as ApiResponse<typeof category>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  updateCategory: protectedProcedure
    .input(categoryValidation.updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...restData } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser?.email) {
          throw new Error('Authentication required');
        }

        const updatePayload: {
          title?: string;
          reference_category?: string;
          category_for?: string;
        } = restData;

        const updatedCategory = await Category.findByIdAndUpdate(
          { _id: id },
          {
            ...updatePayload,
          },
          { new: true }
        );

        return {
          message: 'Category updated successfully',
          status: 200,
          category: updatedCategory,
        };
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  createCategory: protectedProcedure
    .input(categoryValidation.categorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { title, reference_category, ...rest } = input;

        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email) {
          throw new Error('You must be logged in to update this data.');
        }
        const transformedTitle = transformToUppercase(title);

        const categoryExist = await Category.findOne({
          title: transformedTitle,
          creator_id: sessionUser.id,
        });
        if (categoryExist) {
          throw new Error('Category already exists!');
        }

        const category = new Category({
          ...rest,
          title: transformedTitle,
          creator_id: sessionUser.id,
          reference_category,
        });

        await category.save();

        if (!category) {
          throw new Error('Failed to create category');
        }

        return {
          message: 'New Category created successfully',
          status: 200,
          data: category,
        } as ApiResponse<typeof category>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  updateManyCategory: protectedProcedure.query(async () => {
    try {
      // Update all categories to set category_for to "expense"
      await Category.updateMany({}, { $set: { category_for: 'expense' } });

      // Fetch the updated categories
      const categories = await Category.find({});

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
