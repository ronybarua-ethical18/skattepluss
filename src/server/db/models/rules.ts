import mongoose, { Schema } from 'mongoose';
import { IRule, RuleFor } from '../interfaces/rules';

const RuleSchema: Schema = new Schema<IRule>(
  {
    description_contains: { type: String, required: true },
    expense_type: {
      type: String,
      enum: ['personal', 'business'],
      required: true,
    },
    rule_for: {
      type: String,
      enum: Object.values(RuleFor),
      required: true,
    },
    category_title: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

RuleSchema.index({ category_title: 1, user: 1 });
RuleSchema.index({ category_title: 1 });
RuleSchema.index({ description_contains: 1 });

const RuleModel =
  mongoose.models.rule || mongoose.model<IRule>('rule', RuleSchema);

export default RuleModel;
