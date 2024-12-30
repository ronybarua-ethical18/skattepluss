/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SubAnswer {
  [subQuestion: string]: string;
}

export interface Answer {
  [mainQuestion: string]: SubAnswer[];
}

export interface QuestionnaireItem {
  question: string;
  answers: Answer[];
}

interface QuestionnaireState {
  isModalOpen: boolean;
  questionnaires: QuestionnaireItem[];
}

const initialState: QuestionnaireState = {
  isModalOpen: false,
  questionnaires: [],
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    showModal(state, { payload }: PayloadAction<boolean>) {
      state.isModalOpen = payload;
    },
    addQuestionnaire(
      state,
      action: PayloadAction<{ question: string; answers: Answer[] }>
    ) {
      const { question, answers } = action.payload;

      const mergeAnswers = (
        existingAnswers: Answer[],
        newAnswers: Answer[]
      ) => {
        const mergedAnswers = existingAnswers.map((existingAnswer) => {
          const existingKey = Object.keys(existingAnswer)[0];
          const newAnswer = newAnswers.find(
            (answer) => Object.keys(answer)[0] === existingKey
          );

          if (newAnswer) {
            const mergedFields = [
              ...Object.values(existingAnswer)[0].map(
                (field: Record<string, any>) => {
                  const fieldKey = Object.keys(field)[0];
                  const matchingField = Object.values(newAnswer)[0].find(
                    (newField: Record<string, any>) =>
                      Object.keys(newField)[0] === fieldKey
                  );
                  return matchingField || field;
                }
              ),
              ...Object.values(newAnswer)[0].filter(
                (newField: Record<string, any>) =>
                  !Object.values(existingAnswer)[0].some(
                    (field: Record<string, any>) =>
                      Object.keys(field)[0] === Object.keys(newField)[0]
                  )
              ),
            ];
            return { [existingKey]: mergedFields };
          }
          return existingAnswer;
        });

        const newAnswersToAdd = newAnswers.filter(
          (newAnswer) =>
            !existingAnswers.some(
              (existingAnswer) =>
                Object.keys(existingAnswer)[0] === Object.keys(newAnswer)[0]
            )
        );

        return [...mergedAnswers, ...newAnswersToAdd];
      };

      const existingIndex = state.questionnaires.findIndex(
        (item) => item.question === question
      );

      if (existingIndex !== -1) {
        const existingQuestionnaire = state.questionnaires[existingIndex];
        state.questionnaires[existingIndex] = {
          ...existingQuestionnaire,
          answers: mergeAnswers(existingQuestionnaire.answers, answers),
        };
      } else {
        state.questionnaires.push({ question, answers });
      }
    },
    filterAndUpdateQuestionnaires(
      state,
      action: PayloadAction<
        { question: string; answers: string[]; _id?: string }[]
      >
    ) {
      const payload = action.payload;

      state.questionnaires = state.questionnaires
        .map((questionnaire) => {
          const matchingPayload = payload.find(
            (p) => p.question === questionnaire.question
          );

          if (!matchingPayload) return null;

          const updatedAnswers = questionnaire.answers.filter((answer) =>
            matchingPayload.answers.some(
              (payloadAnswer) => Object.keys(answer)[0] === payloadAnswer
            )
          );

          if (updatedAnswers.length === 0) return null;

          return { ...questionnaire, answers: updatedAnswers };
        })
        .filter(
          (questionnaire): questionnaire is QuestionnaireItem =>
            questionnaire !== null
        );
    },
  },
});

export const { showModal, addQuestionnaire, filterAndUpdateQuestionnaires } =
  questionnaireSlice.actions;

export const questionnaireSelector = (state: RootState) => state.questionnaire;

export default questionnaireSlice.reducer;
