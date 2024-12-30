import { z } from 'zod';

const categorySchema = z.object({
  title: z
    .string()
    .min(2, 'Category title must be at least 2 characters')
    .max(50, 'Category title must not exceed 50 characters'),
  reference_category: z.string().optional(),
  category_for: z.enum(['expense', 'income'], {
    required_error: 'Category for is required',
  }),
});
const deleteCategorySchema = z.object({
  _id: z.string().min(1, 'Category ID is required'),
});
const updateCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  title: z
    .string()
    .min(2, 'Category title must be at least 2 characters')
    .max(50, 'Category title must not exceed 50 characters'),
  category_for: z.enum(['expense', 'income'], {
    required_error: 'Category for is required',
  }),
  reference_category: z.string().optional(),
});

export const categoryValidation = {
  categorySchema,
  deleteCategorySchema,
  updateCategorySchema,
};
