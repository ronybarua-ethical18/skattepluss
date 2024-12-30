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
import { useTranslation } from '@/lib/TranslationProvider'; // Import the translation hook
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type ContentHobbyProps = {
  questionnaire?: Questionnaire;
};

export type UploadedImageType = {
  link: string;
  mimeType: string;
  width?: number;
  height?: number;
};

export function ContentHobby({ questionnaire }: ContentHobbyProps) {
  const { translate } = useTranslation();
  const utils = trpc.useUtils();

  const appDispatch = useAppDispatch();

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: 'I have a sole proprietorship',
      content: (
        <>
          {translate('proprietorship.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('revenue')}
          </p>
          <FormInput
            name="I have a sole proprietorship.Revenue"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('revenue_placeholder')}
            defaultValue={getDefaultValue(
              'I have a sole proprietorship',
              'Revenue'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('proprietorship_expense')}
          </p>
          <FormInput
            name="I have a sole proprietorship.proprietorship expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('expense_placeholder')}
            defaultValue={getDefaultValue(
              'I have a sole proprietorship',
              'proprietorship expense'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title:
        'Sell goods or services, blog/influencer, practise e-sports (gaming), breed animals on a small scale',
      content: (
        <>
          {translate('sell_goods_or_services.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('revenue')}
          </p>
          <FormInput
            name="Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale.Revenue"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('revenue_placeholder')}
            defaultValue={getDefaultValue(
              'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
              'Revenue'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('documented_expense')}
          </p>
          <FormInput
            name="Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale.Documented expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('expense_placeholder')}
            defaultValue={getDefaultValue(
              'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
              'Documented expense'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('upload_verification')}
          </p>
          <FormReceiptInput
            name="Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I have received salary from odd jobs and services',
      content: (
        <>
          {translate('received_salary.description')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('received_salary_threshold')}
          </p>
          <FormInput
            name="I have received salary from odd jobs and services.Received salary from odd jobs and services exceeding NOK 6000"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder={translate('yes_no')}
            options={[
              { title: translate('yes'), value: 'yes' },
              { title: translate('no'), value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'I have received salary from odd jobs and services',
              'Received salary from odd jobs and services exceeding NOK 6000'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('odd_job_income')}
          </p>
          <FormInput
            name="I have received salary from odd jobs and services.Odd job income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder={translate('odd_job_income_placeholder')}
            defaultValue={getDefaultValue(
              'I have received salary from odd jobs and services',
              'Odd job income'
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
    <div className="">
      <p className="text-xs text-gray-500">
        {translate('review_questionnaire')}
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
          {translate('done')}
        </Button>
      </form>
    </div>
  );
}
