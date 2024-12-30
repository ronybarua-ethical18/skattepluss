import React from 'react';
import { Label } from '@/components/ui/label';
import Placeholder from '../../../../../../public/receipt_placeholder.jpg';
import PdfPlaceholder from '../../../../../../public/pdf_placeholder.png';
import { PayloadType } from './ExpenseUpdateModal';
import Image from 'next/image';
import formatDate from '@/utils/helpers/formatDate';
import { Button } from '@/components/ui/button';

function ExpenseDetailsContent({ payload }: { payload?: PayloadType }) {
  console.log('reciept__', payload?.receipt);
  const downloadFile = async (
    url: string | undefined,
    filename: string = 'download'
  ) => {
    if (!url) {
      console.error('No URL provided for download');
      return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="font-medium text-lg  text-black ">Expense Details</h1>

      <div className="grid grid-cols-2">
        <div className="space-y-4 text-black text-xs font-medium">
          <p>Date</p>
          <p>Description</p>
          <p>Amount (NOK)</p>
          <p>Expense Type</p>
          <p>Category</p>
        </div>
        <div className="space-y-4 text-[#71717A] text-xs">
          <p>
            {formatDate(payload?.transaction_date || payload?.createdAt || '')}
          </p>
          <p className="text-nowrap truncate">{payload?.description}</p>
          <p>NOK {payload?.amount}</p>
          <p>{payload?.expense_type}</p>
          <p>{payload?.category}</p>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-medium text-black">
          Your attached file
        </Label>
        <div className="w-full border overflow-hidden rounded-lg">
          <Image
            alt="receipt"
            src={
              payload?.receipt?.mimeType === 'pdf'
                ? PdfPlaceholder
                : payload?.receipt?.link || Placeholder
            }
            width={560}
            height={221}
            className="mt-2  w-full h-[221px]"
          />
          {payload?.receipt?.link && (
            <Button
              onClick={() =>
                downloadFile(payload?.receipt?.link, 'receipt.pdf')
              }
              className="w-full text-white rounded-none"
            >
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetailsContent;
