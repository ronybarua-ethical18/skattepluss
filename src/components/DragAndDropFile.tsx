import { Loader2 } from 'lucide-react';
import React from 'react';
import UploadIcon from '../../public/upload.png';
import Image from 'next/image';
import { useTranslation } from '@/lib/TranslationProvider';
import { cn } from '@/lib/utils';

type DragAndDropFileProps = {
  loading: boolean;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  fileLink?: File | null;
  setFileLink?: React.Dispatch<React.SetStateAction<File | null>>;
  type?: string;
};

const DragAndDropFile: React.FC<DragAndDropFileProps> = ({
  type,
  loading,
  getInputProps,
  isDragActive,
}) => {
  const { translate } = useTranslation();
  return (
    <div>
      <input hidden accept=".csv, text/csv" {...getInputProps()} />
      {isDragActive ? (
        <p className="text-[#71717A] p-6">Drop the CSV file here ...</p>
      ) : (
        <div className="flex flex-col space-y-5 justify-center items-center">
          {loading ? (
            <Loader2 size={40} className="animate-spin text-primary  " />
          ) : (
            <Image src={UploadIcon} alt="upload icon" />
          )}
          <div className="text-center">
            <p className="text-[#71717A]">
              {translate('componentsExpenseModal.expense.upload')}
            </p>
            {type === 'csv' ? (
              <p className={cn('text-[#71717A] text-sm')}>
                Only CSV files are allowed with maximum 2MB of file size{' '}
              </p>
            ) : (
              <p className={cn('text-[#71717A] text-sm')}>
                The maximum file size allowed is 10MB.{' '}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragAndDropFile;
