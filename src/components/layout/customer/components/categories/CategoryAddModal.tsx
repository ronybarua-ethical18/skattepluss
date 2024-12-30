import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { Edit2, Loader2 } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulateCategories';

// Define the possible values for category_for
type CategoryFor = 'expense' | 'income';

// Define the form data interface
interface FormData {
  title: string;
  category_for: CategoryFor;
  reference_category: string;
}

type UpdateCategoryPayload = {
  _id: string;
  title?: string;
  reference_category?: string;
  category_for: CategoryFor;
};

interface CategoryAddModalProps {
  origin?: string;
  category?: UpdateCategoryPayload;
}

export default function CategoryAddModal({
  origin,
  category,
}: CategoryAddModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();
  const { translate } = useTranslation();

  const { handleSubmit, control, reset, watch } = useForm<FormData>({
    defaultValues: {
      title: category?.title || '',
      category_for: category?.category_for || undefined,
      reference_category: category?.reference_category || '',
    },
  });

  // Now TypeScript knows these are type-safe
  const categoryForValue = watch('category_for');
  const categoryTitleValue = watch('title');
  const categoryMapValue = watch('reference_category');

  const query = { category_for: categoryForValue || category?.category_for };
  const { manipulatedCategories } = useManipulatedCategories(query);

  const mutation = trpc.categories.createCategory.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully!', {
        duration: 4000,
      });
      utils.categories.getCategories.invalidate();
      reset();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
      setLoading(false);
    },
  });

  const updateMutation = trpc.categories.updateCategory.useMutation({
    onSuccess: () => {
      toast.success('Category is updated successfully!', {
        duration: 4000,
      });
      utils.categories.getCategories.invalidate();
      reset();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
      setLoading(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    if (origin && category) {
      updateMutation.mutate({ id: category._id, ...data });
    } else {
      mutation.mutate(data);
    }
    setOpen(false);
  };

  return (
    <>
      {!origin ? (
        <Button onClick={() => setOpen(true)} variant="purple">
          {translate(
            'components.buttons.category_buttons.text.add_category',
            '+ Add Category'
          )}
        </Button>
      ) : (
        <Edit2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
          onClick={() => setOpen(true)}
        />
      )}
      <div className="bg-white z-50">
        <SharedModal
          open={open}
          onOpenChange={setOpen}
          customClassName="max-w-[500px]"
        >
          <>
            <DialogTitle className="font-medium text-lg text-black leading-tight mb-6">
              {!origin
                ? translate('page.CategoryDataTableColumns.CategoryTitle')
                : translate(
                    'page.CategoryDataTableColumns.CategoryTitleUpdate'
                  )}
            </DialogTitle>

            <>
              <Label className="block mb-2 text-[#101010] text-xs font-medium">
                {translate('page.CategoryDataTableColumns.text')}
              </Label>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  name="title"
                  control={control}
                  type="text"
                  placeholder="Bills"
                  defaultValue={category?.title}
                  required
                />
                <div>
                  <Label className="block mb-2 text-[#101010] text-xs font-medium">
                    Category For
                  </Label>
                  <FormInput
                    name="category_for"
                    defaultValue={category?.category_for}
                    customClassName="w-full mt-2"
                    type="select"
                    control={control}
                    placeholder={`Select category`}
                    options={[
                      { title: 'Expense', value: 'expense' },
                      { title: 'Income', value: 'income' },
                    ]}
                    required
                  />
                </div>
                <div>
                  <Label className="block mb-2 text-[#101010] text-xs font-medium">
                    Map with system defined categories
                  </Label>
                  <FormInput
                    name="reference_category"
                    defaultValue={category?.reference_category}
                    customClassName="w-full mt-2"
                    type="select"
                    control={control}
                    placeholder={`Select category`}
                    options={manipulatedCategories}
                    required
                  />
                </div>
                <Button
                  disabled={
                    loading ||
                    !categoryForValue ||
                    !categoryTitleValue ||
                    !categoryMapValue
                  }
                  type="submit"
                  className="w-full flex h-9 py-2 px-4 justify-center items-center gap-[10px] text-white text-sm font-medium"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{' '}
                  {!origin
                    ? translate('page.CategoryDataTableColumns.CategoryTitle')
                    : translate(
                        'page.CategoryDataTableColumns.CategoryTitleUpdate'
                      )}
                </Button>
              </form>
            </>
          </>
        </SharedModal>
      </div>
    </>
  );
}
