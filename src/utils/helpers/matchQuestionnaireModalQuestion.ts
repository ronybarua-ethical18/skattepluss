import { AccordionItemData } from '@/types/questionnaire';

export const matchQuestionnaireModalQuestion = ({
  questionnaire,
  accordionData,
}: {
  questionnaire: string[] | { [key: string]: string }[];
  accordionData: AccordionItemData[];
}) => {
  console.log({ questionnaire });

  const matchedAccordionData = Array.isArray(questionnaire)
    ? questionnaire
        .flatMap((item) => {
          // Handle array of strings or objects with keys
          if (typeof item === 'string') {
            return item;
          } else if (typeof item === 'object' && item !== null) {
            return Object.keys(item)[0];
          }
          return [];
        })
        .map((answer) => {
          const normalize = (str: string) =>
            str
              .toLowerCase()
              .normalize('NFKD')
              .replace(/[^\w\s]/g, '');

          return accordionData.find((accordion) => {
            const normalizedAnswer = normalize(answer);
            const normalizedTitle = normalize(accordion.title);

            return normalizedTitle.includes(normalizedAnswer);
          });
        })
        .filter((item): item is AccordionItemData => item !== undefined)
    : accordionData;

  return matchedAccordionData;
};
