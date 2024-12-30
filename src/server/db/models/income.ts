import mongoose, { Schema } from 'mongoose';
import { IIncome, IncomeType } from '../interfaces/income';

const IncomeSchema = new Schema<IIncome>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    income_type: {
      type: String,
      enum: Object.values(IncomeType),
      default: IncomeType.unknown,
    },
    amount: {
      type: Number,
      required: true,
    },
    receipt: {
      link: String,
      mimeType: String,
    },
    transaction_date: {
      type: Date,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    rule: {
      type: Schema.Types.ObjectId,
      ref: 'rule',
      //required: true,
    },
  },
  {
    timestamps: true,
  }
);

IncomeSchema.index({ description: 1 });
IncomeSchema.index({ category: 1 });
IncomeSchema.index({ income_type: 1 });

const IncomeModel =
  mongoose.models.income || mongoose.model<IIncome>('income', IncomeSchema);

export default IncomeModel;
