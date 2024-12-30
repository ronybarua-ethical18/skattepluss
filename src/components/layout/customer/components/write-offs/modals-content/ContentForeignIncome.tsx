/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FormInput } from '@/components/FormInput';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { showModal } from '@/redux/slices/questionnaire';
import { AccordionItemData, Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/lib/TranslationProvider';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type ContentForeignIncomeProps = {
  questionnaire?: Questionnaire;
};

export function ContentForeignIncome({
  questionnaire,
}: ContentForeignIncomeProps) {
  const { translate } = useTranslation();
  const utils = trpc.useUtils();

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm();

  const getDefaultValue = (accordionItemTitle: string, fieldName: string) => {
    const answers =
      (questionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemTitle)
      )?.[accordionItemTitle as unknown as any] as unknown as any) || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title:
        'Have income or wealth in another country than Norway and pay tax in the other country',
      content: (
        <>
          {translate(
            'contentForeignIncome.accordionItems.item1.content.description'
          )}
          <p className="text-black pt-3 pb-1">
            {translate(
              'contentForeignIncome.accordionItems.item1.content.fields.foreignIncome'
            )}
          </p>
          <FormInput
            name="Have income or wealth in another country than Norway and pay tax in the other country.Foreign income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have income or wealth in another country than Norway and pay tax in the other country',
              'Foreign income'
            )}
            required
          />
          <p className="text-black pt-3 pb-1">
            {translate(
              'contentForeignIncome.accordionItems.item1.content.fields.foreignTaxAmount'
            )}
          </p>
          <FormInput
            name="Have income or wealth in another country than Norway and pay tax in the other country.Foreign tax amount"
            customClassName="w-full"
            type="number"
            control={control}
            defaultValue={getDefaultValue(
              'Have income or wealth in another country than Norway and pay tax in the other country',
              'Foreign tax amount'
            )}
            placeholder="NOK 200"
            required
          />
          <p className="text-black pt-3 pb-1">
            {translate(
              'contentForeignIncome.accordionItems.item1.content.fields.norwayTaxRate'
            )}
          </p>
          <FormInput
            name="Have income or wealth in another country than Norway and pay tax in the other country.Norway tax rate on this income"
            customClassName="w-full"
            type="number"
            control={control}
            defaultValue={getDefaultValue(
              'Have income or wealth in another country than Norway and pay tax in the other country',
              'Norway tax rate on this income'
            )}
            placeholder="20%"
            required
          />
        </>
      ),
    },
  ];

  const matchedAccordionData = matchQuestionnaireModalQuestion({
    questionnaire: questionnaire?.answers || [],
    accordionData,
  });
  const [openItem, setOpenItem] = useState<string | null>(
    matchedAccordionData.length > 0 ? matchedAccordionData[0].id : null
  );

  const appDispatch = useAppDispatch();

  const handleValueChange = (value: string) => {
    setOpenItem((prevOpen) => (prevOpen === value ? null : value));
  };

  const updateQuestionnaires = trpc.users.updateUserQuestionnaires.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'User questionnaires updation failed!');
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    updateQuestionnaires.mutate(payload);
    appDispatch(showModal(false));
  };

  return (
    <div className=" ">
      <p className="text-xs text-gray-500">
        {translate('contentForeignIncome.reviewQuestionnaire')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Accordion
          type="single"
          value={openItem || undefined}
          onValueChange={handleValueChange}
        >
          {matchedAccordionData.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger
                className={`${
                  openItem === item.id ? 'text-violet-600' : ''
                } no-underline font-bold text-start`}
              >
                {item.title}
              </AccordionTrigger>
              {openItem === item.id && (
                <AccordionContent className="text-gray-500 text-xs">
                  {item.content}
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          disabled={!isDirty || !isValid}
          className="text-white w-full mt-4"
        >
          {translate('contentForeignIncome.doneButton')}
        </Button>
      </form>
    </div>
  );
}
