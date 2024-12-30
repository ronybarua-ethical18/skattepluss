import { Document, Types } from 'mongoose';

export enum Type {
  personal = 'personal',
  business = 'business',
}
export enum RuleFor {
  EXPENSE = 'expense',
  INCOME = 'income',
}
export interface IRule extends Document {
  description_contains: string;
  expense_type?: Type;
  income_type?: Type;
  rule_for: RuleFor;
  category_title: string;
  category: Types.ObjectId | string;
  user: Types.ObjectId;
}
