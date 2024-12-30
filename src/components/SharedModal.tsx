'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  customClassName?: string;
}

const SharedModal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  children,
  customClassName,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />

      <Dialog.Content
        className={`fixed top-1/2 left-1/2 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg ${customClassName || 'max-w-md'}`}
      >
        <Dialog.Title className="sr-only">Dialog Title</Dialog.Title>
        <Dialog.Description className="sr-only">
          Dialog Description
        </Dialog.Description>
        <div>{children}</div>

        <Dialog.Close asChild>
          <button
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SharedModal;
