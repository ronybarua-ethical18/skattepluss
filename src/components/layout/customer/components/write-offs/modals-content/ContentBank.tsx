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
import { useTranslation } from '@/lib/TranslationProvider';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type ContentBankProps = {
  questionnaire?: Questionnaire;
};

export function ContentBank({ questionnaire }: ContentBankProps) {
  const { translate } = useTranslation();
  const appDispatch = useAppDispatch();
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

    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: 'Have a loan?',
      content: (
        <>
          {translate('contentBank.accordionItems.item1.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'contentBank.accordionItems.item1.fields.totalInterestPaid'
            )}
          </p>
          <FormInput
            name="Have a loan.Total interest paid"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue('Have a loan', 'Total interest paid')}
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title: 'Have refinanced a loan in the last year?',
      content: (
        <>
          {translate('contentBank.accordionItems.item2.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'contentBank.accordionItems.item2.fields.refinancingCost'
            )}
          </p>
          <FormInput
            name="Have refinanced a loan in the last year.Refinancing cost"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have refinanced a loan in the last year',
              'Refinancing cost'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'Have taken out a joint loan with someone?',
      content: (
        <>
          {translate('contentBank.accordionItems.item3.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'contentBank.accordionItems.item3.fields.interestAmount'
            )}
          </p>
          <FormInput
            name="Have taken out a joint loan with someone.Interest amount"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have taken out a joint loan with someone',
              'Interest amount'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'contentBank.accordionItems.item3.fields.yourOwnershipShare'
            )}
          </p>
          <FormInput
            name="Have taken out a joint loan with someone.Your ownership share"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="50 %"
            defaultValue={getDefaultValue(
              'Have taken out a joint loan with someone',
              'Your ownership share'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-4',
      title: 'Have young people’s housing savings (BSU)',
      content: (
        <>
          {translate('contentBank.accordionItems.item4.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'contentBank.accordionItems.item4.fields.thisYearsSavings'
            )}
          </p>
          <FormInput
            name="Have young people’s housing savings (BSU).This years savings"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have young people’s housing savings (BSU)',
              'This years savings'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-5',
      title: 'I have sold shares or securities at a loss',
      content: (
        <>
          {translate('contentBank.accordionItems.item5.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('contentBank.accordionItems.item5.fields.totalLoss')}
          </p>
          <FormInput
            name="I have sold shares or securities at a loss.Total loss"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I have sold shares or securities at a loss',
              'Total loss'
            )}
            required
          />
        </>
      ),
    },
  ];

  const answers = questionnaire?.answers || [];
  const matchedAccordionData = matchQuestionnaireModalQuestion({
    questionnaire: answers,
    accordionData,
  });
  const [openItem, setOpenItem] = useState<string | null>(
    matchedAccordionData.length > 0 ? matchedAccordionData[0].id : null
  );

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
    <div>
      <p className="text-xs text-gray-500">
        {translate('contentBank.reviewQuestionnaire')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Accordion
            type="single"
            className="w-full"
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
        </div>
        <Button
          disabled={!isDirty || !isValid}
          type="submit"
          className="text-white w-full mt-4"
        >
          {translate('contentBank.doneButton')}
        </Button>
      </form>
    </div>
  );
}
