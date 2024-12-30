/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { useAppDispatch } from '@/redux/hooks';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import { showModal } from '@/redux/slices/questionnaire';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import { useTranslation } from '@/lib/TranslationProvider'; // Import translation hook
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type AccordionItemData = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type ContentHealthFamilyProps = {
  questionnaire?: Questionnaire;
};

export function ContentHealthFamily({
  questionnaire,
}: ContentHealthFamilyProps) {
  const { translate } = useTranslation();
  const appDispatch = useAppDispatch();
  const utils = trpc.useUtils();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const getDefaultValue = (accordionItemId: string, fieldName: string) => {
    const answers =
      (questionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemId)
      )?.[accordionItemId as unknown as any] as unknown as any) || [];

    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: 'Have children aged 11 years or younger',
      content: (
        <>
          <p>
            {translate('writeOffPage.accordionItems.item1.content.description')}
          </p>
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item1.content.questions.howManyChildren'
            )}
          </p>
          <FormInput
            name="Have children aged 11 years or younger.How many children do you have under the age of 12?"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="2"
            defaultValue={getDefaultValue(
              'Have children aged 11 years or younger',
              'How many children do you have under the age of 12?'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item1.content.questions.documentedExpense'
            )}
          </p>
          <FormInput
            name="Have children aged 11 years or younger.Documented Expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 25000"
            defaultValue={getDefaultValue(
              'Have children aged 11 years or younger',
              'Documented Expense'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title: 'I have children aged 12 or older with special care needs',
      content: (
        <>
          <p>
            {translate('writeOffPage.accordionItems.item2.content.description')}
          </p>
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item2.content.questions.specialCareNeeds'
            )}
          </p>
          <FormInput
            name="I have children aged 12 or older with special care needs.Do you have children with needs for special care?"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder={translate(
              'writeOffPage.accordionItems.item2.options.yes'
            )}
            options={[
              {
                title: translate(
                  'writeOffPage.accordionItems.item2.options.yes'
                ),
                value: 'yes',
              },
              {
                title: translate(
                  'writeOffPage.accordionItems.item2.options.no'
                ),
                value: 'no',
              },
            ]}
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Do you have children with needs for special care?'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item2.content.questions.documentedCareExpenses'
            )}
          </p>
          <FormInput
            name="I have children aged 12 or older with special care needs.Documented care expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 500"
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Documented care expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item2.content.questions.uploadVerification'
            )}
          </p>
          <FormReceiptInput
            name="I have children aged 12 or older with special care needs.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I am a single parent',
      content: (
        <>
          <p>
            {translate('writeOffPage.accordionItems.item3.content.description')}
          </p>
          <ul>
            <li>
              <strong>
                {translate(
                  'writeOffPage.accordionItems.item3.content.details.extendedChildBenefit'
                )}
              </strong>
              :{' '}
              {translate(
                'writeOffPage.accordionItems.item3.content.details.extendedChildBenefitDesc'
              )}
            </li>
            <li>
              <strong>
                {translate(
                  'writeOffPage.accordionItems.item3.content.details.childcareDeductions'
                )}
              </strong>
              :{' '}
              {translate(
                'writeOffPage.accordionItems.item3.content.details.childcareDeductionsDesc'
              )}
            </li>
            <li>
              <strong>
                {translate(
                  'writeOffPage.accordionItems.item3.content.details.commutingDeductions'
                )}
              </strong>
              :{' '}
              {translate(
                'writeOffPage.accordionItems.item3.content.details.commutingDeductionsDesc'
              )}
            </li>
          </ul>
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

  const updateQuestionnaires = trpc.users.updateUserQuestionnaires.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'User questionnaires updation failed!');
    },
  });
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    updateQuestionnaires.mutate(payload);
    appDispatch(showModal(false));
  };

  const handleValueChange = (value: string) => {
    setOpenItem((prevOpen) => (prevOpen === value ? null : value));
  };

  return (
    <div>
      <p className="text-xs text-gray-500">
        {translate('writeOffPage.reviewQuestionnaire')}
      </p>
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
                <AccordionContent className="text-gray-500 text-xs">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Button
          disabled={!isDirty || !isValid}
          type="submit"
          className="text-white w-full mt-4"
        >
          {translate('writeOffPage.doneButton')}
        </Button>
      </form>
    </div>
  );
}
