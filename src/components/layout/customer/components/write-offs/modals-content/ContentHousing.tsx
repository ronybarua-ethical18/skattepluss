/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FormInput } from '@/components/FormInput';
import { FormReceiptInput } from '@/components/FormReceiptInput';
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

type ContentHousingProps = {
  questionnaire?: Questionnaire;
};

export type UploadedImageType = {
  link: string;
  mimeType: string;
  width?: number;
  height?: number;
};

export function ContentHousing({ questionnaire }: ContentHousingProps) {
  const { translate } = useTranslation();
  const utils = trpc.useUtils();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const getDefaultValue = (accordionItemTitle: string, fieldName: string) => {
    const answers =
      (questionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemTitle)
      )?.[accordionItemTitle as unknown as any] as unknown as any) || [];

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      answers.find((field: any) => field[fieldName])?.[fieldName] || ''
    );
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title:
        'Housing in a housing association, housing company or jointly owned property',
      content: (
        <>
          {translate(
            'housing.section1.description',
            'You can deduct related expenses such as part of your mortgage interest, electricity, insurance, and maintenance costs based on the proportion of the property rented out.'
          )}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('housing.section1.documentedCost', 'Documented cost')}
          </p>
          <FormInput
            name="Housing in a housing association housing company or jointly owned property.Documented cost"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('housing.placeholder.amount', 'NOK 200')}
            defaultValue={getDefaultValue(
              'Housing in a housing association housing company or jointly owned property',
              'Documented cost'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'housing.section1.uploadVerification',
              'Upload verification document'
            )}
          </p>
          <FormReceiptInput
            name="Housing in a housing association housing company or jointly owned property.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Housing in a housing association housing company or jointly owned property',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title: 'I have rented out a residential property or a holiday home',
      content: (
        <>
          {translate(
            'housing.section2.description',
            'Expenses: Include property maintenance, repairs, insurance, and a portion of mortgage interest. If the property is used solely for renting, you may be able to deduct 100% of the relevant expenses.'
          )}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('housing.section2.expense', 'Expense')}
          </p>
          <FormInput
            name="I have rented out a residential property or a holiday home.Expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('housing.placeholder.amount', 'NOK 200')}
            defaultValue={getDefaultValue(
              'I have rented out a residential property or a holiday home',
              'Expense'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'Sold a residential property or holiday home profit or loss',
      content: (
        <>
          {translate(
            'housing.section3.description',
            'If the property has been your primary residence for at least 12 of the last 24 months before the sale, the capital gains from the sale are tax-free.'
          )}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'housing.section3.primaryResidence',
              'Was the property your primary residence for at least 12 of the last 24 months?'
            )}
          </p>
          <FormInput
            name="Sold a residential property or holiday home profit or loss.Was the property your primary residence for at least 12 of the last 24 months"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder={translate('housing.placeholder.yes', 'Yes')}
            options={[
              { title: translate('commonButton.yes', 'Yes'), value: 'yes' },
              { title: translate('commonButton.no', 'No'), value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'Sold a residential property or holiday home profit or loss',
              'Was the property your primary residence for at least 12 of the last 24 months'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('housing.section3.capitalGain', 'Capital gain or loss')}
          </p>
          <FormInput
            name="Sold a residential property or holiday home profit or loss.Capital gain or loss"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('housing.placeholder.amount', 'NOK 200')}
            defaultValue={getDefaultValue(
              'Sold a residential property or holiday home profit or loss',
              'Capital gain or loss'
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
    <div className="">
      <p className="text-xs text-gray-500">
        {translate('housing.review', 'Review Questionnaire')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Accordion
            type="single"
            className="w-full"
            value={openItem || undefined}
            onValueChange={handleValueChange}
          >
            {matchedAccordionData.map(({ id, title, content }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger
                  className={`${
                    openItem === id ? 'text-violet-600' : ''
                  } no-underline font-bold text-start`}
                >
                  {title}
                </AccordionTrigger>
                {openItem === id && (
                  <AccordionContent className="text-gray-500 text-xs">
                    {content}
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
          {translate('housing.submit', 'Done')}
        </Button>
      </form>
    </div>
  );
}
