import { z } from 'zod';

const createExpenseSchema = z.object({
  id: z.string({}).optional(),
  description: z.string({
    required_error: 'Description is required',
  }),
  expense_type: z.enum(['personal', 'business', 'unknown'], {
    required_error: 'Expense type is required',
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
const createBulkExpenseSchema = z.array(
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

// Schema for the expense update payload
const expenseUpdatePayloadSchema = z.object({
  rule: z.string(),
  category: z.string(),
  expense_type: z.string(),
});

// Schema for the updateBulkExpense API input
const updateBulkExpenseSchema = z.object({
  expenses: z.array(
    z.object({
      expenseUpdatePayload: expenseUpdatePayloadSchema, // Assuming this schema is defined elsewhere
      _id: z.string(), // The ID of the expense to be updated
    })
  ),
});

export const expenseValidation = {
  createExpenseSchema,
  createBulkExpenseSchema,
  updateBulkExpenseSchema,
};
