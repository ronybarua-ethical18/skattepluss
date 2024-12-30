/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@/server/db/models/user';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { userValidation } from './users.validation';
import { z } from 'zod';

type Answer = z.infer<typeof userValidation.answerSchema>;
type QuestionnaireItem = z.infer<typeof userValidation.userQuestionnaireSchema>;

export const userRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const loggedUser = ctx.user as JwtPayload;
    const users = await User.find({});

    return {
      users,
      loggedUser,
    };
  }),

  getUserByEmail: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;

    if (!sessionUser || !sessionUser.id) {
      throw new Error('You must be logged in to access this data.');
    }

    const user = await User.findOne({
      $or: [{ _id: sessionUser.id }, { email: sessionUser.email }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return sessionUser?.audit_for ? { ...user._doc, role: 'auditor' } : user;
  }),

  updateUser: protectedProcedure
    .input(userValidation.userSchema)
    .mutation(async ({ ctx, input }) => {
      const { questionnaires = [] } = input;

      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error('You must be logged in to update this data.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      const existingQuestionnaires = user.questionnaires || [];

      const mergedQuestionnaires = questionnaires.map(
        (payloadQuestionnaire) => {
          const existingQuestionnaire = existingQuestionnaires.find(
            (q: any) => q.question === payloadQuestionnaire.question
          );

          if (existingQuestionnaire) {
            const updatedAnswers = payloadQuestionnaire.answers.map(
              (payloadAnswer) => {
                const existingAnswer = existingQuestionnaire.answers.find(
                  (answer: any) => Object.keys(answer)[0] === payloadAnswer
                );

                if (existingAnswer) {
                  return existingAnswer;
                }
                return { [payloadAnswer]: [] };
              }
            );

            return {
              question: payloadQuestionnaire.question,
              answers: updatedAnswers,
            };
          }

          return {
            question: payloadQuestionnaire.question,
            answers: payloadQuestionnaire.answers.map((answer) => ({
              [answer]: [],
            })),
          };
        }
      );

      const preservedQuestionnaires = existingQuestionnaires.filter(
        (existingQuestionnaire: any) =>
          !questionnaires.some(
            (payloadQuestionnaire) =>
              payloadQuestionnaire.question === existingQuestionnaire.question
          )
      );

      const finalQuestionnaires = [
        ...mergedQuestionnaires,
        ...preservedQuestionnaires,
      ];

      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { questionnaires: finalQuestionnaires },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User update failed');
      }

      return updatedUser;
    }),

  updateUserQuestionnaires: protectedProcedure
    .input(userValidation.userQuestionnaireSchema)
    .mutation(async ({ ctx, input }) => {
      const { question, answers } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error('You must be logged in to update questionnaires.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }
      const mergeAnswers = (
        existingAnswers: (string | Answer)[],
        newAnswers: Answer[]
      ): Answer[] => {
        const mergedMap = new Map<string, Map<string, string>>();

        existingAnswers.forEach((answer) => {
          if (typeof answer === 'string') {
            mergedMap.set(answer, new Map());
          } else {
            const [key, fields] = Object.entries(answer)[0];
            const fieldMap = new Map(
              fields.map((field) => Object.entries(field)[0])
            );
            mergedMap.set(key, fieldMap);
          }
        });

        newAnswers.forEach((answer) => {
          const [key, fields] = Object.entries(answer)[0];
          if (!mergedMap.has(key)) {
            mergedMap.set(
              key,
              new Map(fields.map((field) => Object.entries(field)[0]))
            );
          } else {
            const existingFieldMap = mergedMap.get(key)!;
            fields.forEach((field) => {
              const [fieldKey, fieldValue] = Object.entries(field)[0];
              existingFieldMap.set(fieldKey, fieldValue); // Overwrite if field exists or add new
            });
          }
        });

        return Array.from(mergedMap.entries()).map(([key, fieldsMap]) => ({
          [key]: Array.from(fieldsMap.entries()).map(
            ([fieldKey, fieldValue]) => ({
              [fieldKey]: fieldValue,
            })
          ),
        }));
      };

      const questionnaires = user.questionnaires || [];
      const existingIndex = questionnaires.findIndex(
        (item: QuestionnaireItem) => item.question === question
      );

      if (existingIndex !== -1) {
        const existingQuestionnaire = questionnaires[existingIndex];
        questionnaires[existingIndex] = {
          question: existingQuestionnaire.question,
          answers: mergeAnswers(existingQuestionnaire.answers, answers),
        };
      } else {
        questionnaires.push({ question, answers });
      }
      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { questionnaires },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('Failed to update user questionnaires.');
      }

      return updatedUser;
    }),
});
