import { Document, Types } from 'mongoose';

export enum CategoryFor {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export interface ICategory extends Document {
  title: string;
  created_by: string;
  reference_category?: string;
  category_for: CategoryFor;
  creator_id: Types.ObjectId;
}
