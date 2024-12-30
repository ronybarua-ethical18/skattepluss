interface Questionnaire {
  question: string;
  answers: string[];
}

export const questionMatcherEngine = (
  question: string,
  questionnaires: Questionnaire[]
): Questionnaire | undefined => {
  if (!question || !questionnaires) return undefined;

  const matchedQuestion = questionnaires.find(
    (questionnaire) =>
      questionnaire.question.toLowerCase() === question.toLowerCase()
  );

  return matchedQuestion;
};
