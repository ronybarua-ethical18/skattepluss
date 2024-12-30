import { z } from 'zod';

const createIncomeSchema = z.object({
  id: z.string({}).optional(),
  description: z.string({
    required_error: 'Description is required',
  }),
  income_type: z.enum(['personal', 'business', 'unknown'], {
    required_error: 'Income type is required',
  }),
  category: z.string({
    required_error: 'Category is required',
  }),
  amount: z.number({
    required_error: 'Amount is required',
  }),
  receipt: z.object({
    link: z.string(),
    mimeType: z.string(),
  }),
});
const createBulkIncomeSchema = z.array(
  z.object({
    description: z.string({
      required_error: 'Description is required',
    }),
    amount: z.number({
      required_error: 'Amount is required',
    }),
    transaction_date: z.any().optional(),
  })
);

const incomeUpdatePayloadSchema = z.object({
  rule: z.string(),
  category: z.string(),
  income_type: z.string(),
});

const updateBulkIncomeSchema = z.object({
  incomes: z.array(
    z.object({
      incomeUpdatePayload: incomeUpdatePayloadSchema,
      _id: z.string(),
    })
  ),
});

export const IncomeValidations = {
  createIncomeSchema,
  createBulkIncomeSchema,
  updateBulkIncomeSchema,
};
