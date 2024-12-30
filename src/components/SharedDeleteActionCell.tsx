'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import SharedModal from './SharedModal';
import DeleteConfirmationContent from './DeleteConfirmationContent';

const SharedDeleteActionCell = ({
  itemId,
  itemOrigin,
}: {
  itemId: string;
  itemOrigin: string;
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setModalOpen(true);
  };

  return (
    <div className="flex items-center space-x-2 my-2">
      <div>
        <Trash2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer"
          onClick={handleDelete}
        />
        <div className="bg-white z-50">
          <SharedModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            customClassName="max-w-[500px]"
          >
            <DeleteConfirmationContent
              itemId={itemId}
              itemOrigin={itemOrigin}
              setModalOpen={setModalOpen}
            />
          </SharedModal>
        </div>
      </div>
    </div>
  );
};
export default SharedDeleteActionCell;
