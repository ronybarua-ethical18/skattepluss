/* eslint-disable @typescript-eslint/no-explicit-any */
export const filterAndUpdateQuestionnaires = (
  existingQuestionnaires: any[],
  newQuestionnaires: any[]
) => {
  const updatedQuestionnaires = newQuestionnaires.map((newQ) => {
    const existingQ = existingQuestionnaires.find(
      (q) => q.question === newQ.question
    );

    if (existingQ) {
      const mergedAnswers = [
        ...existingQ.answers.filter(
          (existingAnswer: any) =>
            !newQ.answers.some((newAnswer: any) =>
              typeof existingAnswer === 'string'
                ? existingAnswer === newAnswer
                : Object.keys(existingAnswer)[0] === Object.keys(newAnswer)[0]
            )
        ),
        ...newQ.answers,
      ];

      return { ...existingQ, answers: mergedAnswers };
    }

    return newQ;
  });

  const preservedQuestionnaires = existingQuestionnaires.filter(
    (existingQ) =>
      !newQuestionnaires.some((newQ) => newQ.question === existingQ.question)
  );

  return [...updatedQuestionnaires, ...preservedQuestionnaires];
};
