type FormData = Record<string, Record<string, string>>;

interface SubAnswer {
  [subQuestion: string]: string;
}

interface Answer {
  [mainQuestion: string]: SubAnswer[];
}

interface AddQuestionnairePayload {
  question: string;
  answers: Answer[];
}

export const transformFormDataToPayload = (
  question: string,
  formData: FormData
): AddQuestionnairePayload => {
  const answers: Answer[] = Object.entries(formData).map(
    ([mainQuestion, subQuestions]) => ({
      [mainQuestion]: Object.entries(subQuestions).map(
        ([subQuestion, answer]) => ({
          [subQuestion]: answer,
        })
      ),
    })
  );

  return {
    question,
    answers,
  };
};
