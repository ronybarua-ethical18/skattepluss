import React, { useState } from 'react';

import SharedModal from '@/components/SharedModal';
import { FaEye } from 'react-icons/fa';
import IncomeDetailsContent from './IncomeDetailsContent';

export type PayloadType = {
  amount: number;
  category: string;
  description: string;
  income_type: string;
  transaction_date?: string;
  createdAt?: string;
  __v?: number;
  _id: string;
};

export default function IncomeDetailsModal({
  payload,
}: {
  payload: PayloadType;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <FaEye
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
            <IncomeDetailsContent payload={payload} />
          </div>
        </SharedModal>
      </div>
    </>
  );
}
