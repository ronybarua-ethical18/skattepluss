import mongoose, { Schema } from 'mongoose';
import { CategoryFor, ICategory } from '../interfaces/category';

const CategorySchema: Schema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
    created_by: {
      type: String,
      enum: ['USER', 'SYSTEM'],
      default: 'USER',
    },
    reference_category: {
      type: String,
      default: null,
    },
    category_for: {
      type: String,
      enum: Object.values(CategoryFor),
      required: true,
    },
    creator_id: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true }
);

// Compound index with unique constraint for title and creator_id
CategorySchema.index({ title: 1, creator_id: 1 }, { unique: true });

const CategoryModel =
  mongoose.models.category ||
  mongoose.model<ICategory>('category', CategorySchema);

export default CategoryModel;
