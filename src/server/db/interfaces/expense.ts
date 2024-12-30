import { Date, Document, Types } from 'mongoose';

export enum ExpenseType {
  business = 'business',
  personal = 'personal',
  unknown = 'unknown',
}

export enum DeductionStatus {
  deductible = 'deductible',
  non_deductible = 'non_deductible',
}

export interface IExpense extends Document {
  description: string;
  category: string;
  expense_type: ExpenseType;
  amount: number;
  transaction_date?: Date;
  deduction_status: DeductionStatus;
  user: Types.ObjectId;
  rule: Types.ObjectId;
  receipt?: {
    link: string;
    mimeType: string;
  };
}
export interface IExpenseUpdate extends Document {
  id: string;
  description: string;
  category: string;
  expense_type: ExpenseType;
  amount: number;
  transaction_date?: Date;
  deduction_status: DeductionStatus;
  user: Types.ObjectId;
  rule: Types.ObjectId;
  receipt?: {
    link: string;
    mimeType: string;
  };
}
