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

type ContentWorkProps = {
  questionnaire?: Questionnaire;
};

export function ContentWork({ questionnaire }: ContentWorkProps) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };
  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title:
        'The return distance between home and work is more than 37 kilometres',
      content: (
        <>
          {translate('contentwork.home_to_work_comprehension')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.number_of_workdays')}
          </p>
          <FormInput
            name="The return distance between home and work is more than 37 kilometres.Number of Workdays"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="40 km"
            defaultValue={getDefaultValue(
              'The return distance between home and work is more than 37 kilometres',
              'Number of Workdays'
            )}
            required
          />
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.distance')}
          </p>
          <FormInput
            name="The return distance between home and work is more than 37 kilometres.Distance"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="40 km"
            defaultValue={getDefaultValue(
              'The return distance between home and work is more than 37 kilometres',
              'Distance'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title:
        'Have expenses for road toll or ferry when travelling between your home and workplace',
      content: (
        <>
          {translate('contentwork.road_toll_expenses')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.documented_expenses')}
          </p>
          <FormInput
            name="Have expenses for road toll or ferry when travelling between your home and workplace.Documented Expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have expenses for road toll or ferry when travelling between your home and workplace',
              'Documented Expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('contentwork.upload_verification_document')}
          </p>
          <FormReceiptInput
            name="Have expenses for road toll or ferry when travelling between your home and workplace.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Have expenses for road toll or ferry when travelling between your home and workplace',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I Stay away from home overnight because of work',
      content: (
        <>
          {translate('contentwork.stay_away_over_night')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.meals_accommodation_cost')}
          </p>
          <FormInput
            name="I Stay away from home overnight because of work.Meals and accommodation cost"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I Stay away from home overnight because of work',
              'Meals and accommodation cost'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-4',
      title: 'Moved for a new job',
      content: (
        <>
          {translate('contentwork.moved_for_new_job')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.documented_expenses')}
          </p>
          <FormInput
            name="Moved for a new job.Documented expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Moved for a new job',
              'Documented expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('contentwork.upload_verification_document')}
          </p>
          <FormReceiptInput
            name="Moved for a new job.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Moved for a new job',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-5',
      title: 'I work as a fisherman',
      content: (
        <>
          {translate('contentwork.work_as_fisherman')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.fishing_income')}
          </p>
          <FormInput
            name="I work as a fisherman.Fishing Income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I work as a fisherman',
              'Fishing Income'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-6',
      title: 'I work as a seafarer',
      content: (
        <>
          {translate('contentwork.work_as_seafarer')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.seafarer_income')}
          </p>
          <FormInput
            name="I work as a seafarer.Seafarer Income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I work as a seafarer',
              'Seafarer Income'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-7',
      title: 'I went to school last year',
      content: (
        <>
          {translate('contentwork.went_to_school_last_year')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.documented_education_expenses')}
          </p>
          <FormInput
            name="I went to school last year.Documented Education Expenses (if job-related)"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I went to school last year',
              'Documented Education Expenses (if job-related)'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('contentwork.upload_verification_document')}
          </p>
          <FormReceiptInput
            name="I went to school last year.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'I went to school last year',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-8',
      title: 'I am a foreign employee',
      content: (
        <>
          {translate('contentwork.foreign_employee')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.taxable_income')}
          </p>
          <FormInput
            name="I am a foreign employee.Taxable Income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I am a foreign employee',
              'Taxable Income'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-9',
      title: 'Member of Trade Union',
      content: (
        <>
          <div className="space-y-3">
            <p>{translate('contentwork.trade_union_deduction')}</p>
            <p>{translate('contentwork.maximum_deduction')}</p>
          </div>
        </>
      ),
    },
    {
      id: 'item-10',
      title: 'Living in Norway only in part of a year',
      content: (
        <>
          {translate('contentwork.living_in_norway')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('contentwork.spent_183_days_in_norway')}
          </p>
          <FormInput
            name="living in Norway only in a part of a year.Have you spent more than 183 days in Norway"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder={translate('contentwork.yes')}
            options={[
              { title: translate('contentwork.yes'), value: 'yes' },
              { title: translate('contentwork.no'), value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'living in Norway only in a part of a year',
              'Have you spent more than 183 days in Norway'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-11',
      title: 'Disputation of a PhD',
      content: (
        <>
          {translate('contentwork.disputation_phd')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.documented_costs_for_thesis')}
          </p>
          <FormInput
            name="Disputation of a PhD.Documented Costs for Thesis Printing Travel and Defense Ceremony"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Disputation of a PhD',
              'Documented Costs for Thesis Printing Travel and Defense Ceremony'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('contentwork.upload_verification_document')}
          </p>
          <FormReceiptInput
            name="Disputation of a PhD.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Disputation of a PhD',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-12',
      title: 'Have a separate room in your house used only as your home office',
      content: (
        <>
          {translate('contentwork.separate_room_home_office')}
          <p className="text-black pt-3 pb-1">
            {translate('contentwork.home_area')}
          </p>
          <FormInput
            name="Have a separate room in your house used only as your home office.Home Area"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="2000 Sq ft"
            defaultValue={getDefaultValue(
              'Have a separate room in your house used only as your home office',
              'Home Area'
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
    <div>
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Accordion
            type="single"
            value={openItem || undefined}
            onValueChange={handleValueChange}
            className="w-full"
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
          </Accordion>{' '}
        </div>
        <Button
          disabled={!isDirty || !isValid}
          type="submit"
          className="text-white w-full mt-4"
        >
          Done
        </Button>
      </form>
    </div>
  );
}
