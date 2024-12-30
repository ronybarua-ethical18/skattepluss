'use client';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Button } from './ui/button';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

interface IDeleteProps {
  itemId: string;
  itemOrigin: string;
  setModalOpen: (open: boolean) => void;
}

function DeleteConfirmationContent({
  itemId,
  itemOrigin,
  setModalOpen,
}: IDeleteProps) {
  const deleteRuleMutation = trpc.rules.deleteRule.useMutation();
  const deleteExpenseMutation = trpc.expenses.deleteExpense.useMutation();
  const deleteIncomeMutation = trpc.incomes.deleteIncome.useMutation();
  const deleteCategoryMutation = trpc.categories.deleteCategory.useMutation();

  const getMutation = () => {
    switch (itemOrigin) {
      case 'rule':
        return deleteRuleMutation;
      case 'expense':
        return deleteExpenseMutation;
      case 'income':
        return deleteIncomeMutation;
      case 'category':
        return deleteCategoryMutation;
      default:
        throw new Error('Invalid item origin');
    }
  };

  const invalidateQuery = () => {
    switch (itemOrigin) {
      case 'rule':
        utils.rules.getRules.invalidate();
        break;
      case 'expense':
        utils.expenses.getExpenses.invalidate();
        break;
      case 'income':
        utils.incomes.getIncomes.invalidate();
        break;
      case 'category':
        utils.categories.getCategories.invalidate();
        break;
      default:
        throw new Error('Invalid item origin');
    }
  };

  const utils = trpc.useUtils();
  const handleDelete = () => {
    const mutation = getMutation();
    mutation.mutate(
      { _id: itemId },
      {
        onSuccess: () => {
          toast.success(`Deleted ${itemOrigin} row successfully`);
          invalidateQuery();
          setModalOpen(false);
        },
      }
    );
  };
  return (
    <div className="bg-white w-full mt-5">
      <div className="flex flex-col items-center">
        <CrossCircledIcon
          className="w-12 h-12 mb-3 text-[#FF6347]" // Tomato color
          onClick={() => setModalOpen(false)}
        />
        <p className="text-l">{`Do you really want to delete the ${itemOrigin}?`}</p>
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white mr-3 bg-[#FF6347] hover:bg-[#D94F33]" // Tomato color with hover
          onClick={handleDelete}
        >
          Confirm
        </Button>
        <Button
          onClick={() => setModalOpen(false)}
          className="bg-gray-200 hover:bg-gray-200"
        >
          Discard
        </Button>
      </div>
    </div>
  );
}

export default DeleteConfirmationContent;
