/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/redux/hooks';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import { showModal } from '@/redux/slices/questionnaire';
import { FormInput } from '@/components/FormInput';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import { useTranslation } from '@/lib/TranslationProvider';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Questionnaire } from '@/types/questionnaire';

export function ContentDonation({
  questionnaire,
}: {
  questionnaire?: Questionnaire;
}) {
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

  const appDispatch = useAppDispatch();

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
    <Card className="border-none shadow-none p-0">
      <p className="text-xs text-gray-500">
        {translate('contentDonation.reviewQuestionnaire')}
      </p>
      <CardHeader className="px-0">
        <CardTitle className="start text-xl font-semibold">
          {translate('contentDonation.cardTitle')}
        </CardTitle>
        <CardDescription className="text-xs">
          {translate('contentDonation.cardDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                {translate('contentDonation.fields.donationAmount')}
              </Label>
              <FormInput
                name="Gifts to voluntary organisations.Donation Amount"
                customClassName="w-full"
                type="number"
                control={control}
                placeholder={translate('contentDonation.fields.donationAmount')}
                defaultValue={getDefaultValue(
                  'Gifts to voluntary organisations',
                  'Donation Amount'
                )}
                required
              />
              <Label className="text-black pt-[12px] pb-[6px]">
                {translate('contentDonation.fields.uploadVerificationDocument')}
              </Label>
              <FormReceiptInput
                name="Gifts to voluntary organisations.Upload verification document"
                control={control}
                setValue={setValue}
                defaultValue={getDefaultValue(
                  'Gifts to voluntary organisations',
                  'Upload verification document'
                )}
              />
            </div>
          </div>
          <Button
            disabled={!isDirty || !isValid}
            type="submit"
            className="text-white w-full"
          >
            {translate('contentDonation.doneButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
