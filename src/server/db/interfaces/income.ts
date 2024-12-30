import { Date, Document, Types } from 'mongoose';

export enum IncomeType {
  business = 'business',
  personal = 'personal',
  unknown = 'unknown',
}

export interface IIncome extends Document {
  description: string;
  category: string;
  income_type: IncomeType;
  amount: number;
  transaction_date?: Date;
  user: Types.ObjectId;
  rule: Types.ObjectId;
  receipt?: {
    link: string;
    mimeType: string;
  };
}
export interface IIncomeUpdate extends Document {
  id: string;
  description: string;
  category: string;
  income_type: IncomeType;
  amount: number;
  transaction_date?: Date;
  user: Types.ObjectId;
  rule: Types.ObjectId;
  receipt?: {
    link: string;
    mimeType: string;
  };
}
