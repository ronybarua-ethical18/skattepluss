import React, { useState } from 'react';

import SharedModal from '@/components/SharedModal';
import { Edit2 } from 'lucide-react';
import ExpenseAddContent from './ExpenseAddContent';
import { useManipulatedCategories } from '@/hooks/useManipulateCategories';

export type PayloadType = {
  amount: number;
  category: string;
  description: string;
  expense_type: string;
  transaction_date?: string;
  createdAt?: string;
  receipt?: {
    link: string;
    mimeType: string;
  };
  deduction_status?: string;
  __v?: number;
  _id: string;
};

export default function ExpenseUpdateModal({
  payload,
}: {
  payload: PayloadType;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const query = { category_for: 'expense' };
  const { manipulatedCategories } = useManipulatedCategories(query);

  return (
    <>
      <Edit2
        className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
        onClick={handleButtonClick}
      />
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[500px]"
        >
          <div className="bg-white">
            <ExpenseAddContent
              origin="expense update"
              setModalOpen={setModalOpen}
              categories={manipulatedCategories}
              payload={payload}
            />
          </div>
        </SharedModal>
      </div>
    </>
  );
}
