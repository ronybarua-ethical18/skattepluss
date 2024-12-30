import { Button } from '@/components/ui/button';
import React from 'react';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/TranslationProvider'; // Import translation hook
import { useManipulatedCategories } from '@/hooks/useManipulateCategories';
import { UpdateRuleProps } from '@/types/questionnaire';

type RuleFormData = {
  description_contains: string;
  expense_type: 'business' | 'personal';
  category: string;
  rule_for: 'expense' | 'income';
};

type CategoryType = { title: string; value: string };

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  updateRulePayload?: UpdateRuleProps;
  origin: string | undefined;
  rule_for?: 'expense' | 'income';
};

function CreateRuleModalContent({
  modalClose,
  updateRulePayload,
  origin,
}: ExpenseRuleContentProps) {
  // Use the translation hook
  const { handleSubmit, control, watch } = useForm<RuleFormData>({
    defaultValues: { expense_type: 'business' }, // Optional default value
  });
  const { translate } = useTranslation();
  const utils = trpc.useUtils();

  const categoryForValue = watch('rule_for');

  const query = {
    category_for: categoryForValue || updateRulePayload?.rule_for,
  };
  const { manipulatedCategories } = useManipulatedCategories(query);
  const ruleMutation = trpc.rules.createRule.useMutation({
    onSuccess: () => {
      toast.success(translate('toast.ruleCreatedSuccess')); // Use translation here
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate(); // Invalidate and refetch getRules query
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const ruleUpdateMutation = trpc.rules.updateRule.useMutation({
    onSuccess: () => {
      toast.success(translate('toast.ruleUpdatedSuccess')); // Use translation here
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate(); // Invalidate and refetch getRules query
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: RuleFormData) => {
    if (origin && updateRulePayload) {
      ruleUpdateMutation.mutate({ _id: updateRulePayload?._id, ...data });
    } else {
      ruleMutation.mutate(data);
    }
  };

  return (
    <div>
      <h1 className="font-medium text-lg text-black mb-4">
        {translate('componentsRuleModal.rule.if')}
      </h1>{' '}
      {/* Translate 'IF' */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="description_contains">
            {translate('componentsRuleModal.rule.descriptionContains')}
          </Label>
          <FormInput
            type="text"
            name="description_contains"
            placeholder={translate(
              'componentsRuleModal.rule.descriptionContains'
            )}
            control={control}
            customClassName="w-full mt-2"
            defaultValue={updateRulePayload?.description_contains}
            required
          />
        </div>
        <h1 className="font-medium text-lg text-black mb-4">
          {translate('componentsRuleModal.rule.then')}
        </h1>{' '}
        {/* Translate 'Then' */}
        <div>
          <Label>Rule For</Label>
          <FormInput
            name="rule_for"
            defaultValue={updateRulePayload?.rule_for}
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder={`Select rule for`}
            options={[
              { title: 'Expense', value: 'expense' },
              { title: 'Income', value: 'income' },
            ]}
            required
          />
        </div>
        <div>
          <Label htmlFor="expense_type">
            {translate('componentsRuleModal.rule.expenseType')}
          </Label>
          <FormInput
            name="expense_type"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            defaultValue={updateRulePayload?.expense_type}
            placeholder={translate('componentsRuleModal.rule.selectType')}
            options={[
              {
                title: translate('componentsRuleModal.rule.business'),
                value: 'business',
              },
              {
                title: translate('componentsRuleModal.rule.personal'),
                value: 'personal',
              },
            ]}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">
            {translate('componentsRuleModal.rule.category')}
          </Label>
          <FormInput
            name="category"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder={translate('componentsRuleModal.rule.selectCategory')}
            defaultValue={updateRulePayload?.category_title}
            options={manipulatedCategories}
            required
          />
        </div>
        <div className="py-3">
          <Button type="submit" className="w-full text-white">
            {!origin
              ? translate('componentsRuleModal.rule.create')
              : translate('componentsRuleModal.rule.update')}
          </Button>
          <Button
            type="button"
            className="w-full bg-[#F0EFFE] text-[#FF4444] hover:bg-[#F0EFFE] mt-3"
            onClick={() => modalClose && modalClose(false)} // Close modal on discard
          >
            {translate('componentsRuleModal.rule.discard')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateRuleModalContent;
