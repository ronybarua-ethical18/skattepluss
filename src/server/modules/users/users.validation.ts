import { z } from 'zod';

const subAnswerSchema = z.record(z.string());

const answerSchema = z.record(z.array(subAnswerSchema));
const userQuestionnaireSchema = z.object({
  question: z.string(),
  answers: z.array(answerSchema),
});
const userSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  provider: z.enum(['credentials', 'google']).optional(),
  role: z.enum(['admin', 'auditor', 'customer']).optional(),
  image: z.string().optional(),
  questionnaires: z
    .array(
      z.object({
        question: z.string(),
        answers: z.array(z.string()),
      })
    )
    .optional(),
  isVerified: z.boolean().optional(),
});
export const userValidation = {
  userSchema,
  userQuestionnaireSchema,
  answerSchema,
};
