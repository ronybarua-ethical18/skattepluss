'use client';
import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormInput';
import DragAndDropFile from '@/components/DragAndDropFile';
import { useDropzone } from 'react-dropzone';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';

type FormData = {
  Description: string;
  Withdrawal: string;
  Deposit: string;
  Date?: string;
};

type Column = {
  title: string;
  dataIndex: string;
  key: string;
};

type FileRowData = {
  key: string;
  [key: string]: string;
};

type ExpenseData = {
  description: string;
  withdrawal: number;
  deposit: number;
  transaction_date: Date;
};

const targetColumns: Column[] = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Withdrawal',
    dataIndex: 'withdrawal',
    key: 'withdrawal',
  },
  {
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

const findBestMatch = (
  columnTitle: string,
  headers: Column[]
): string | undefined => {
  // Convert to lowercase for case-insensitive matching
  const targetTitle = columnTitle.toLowerCase();

  // First try exact match
  const exactMatch = headers.find(
    (header) => header.title.toLowerCase() === targetTitle
  );
  if (exactMatch) return exactMatch.title;

  // Then try partial match
  const partialMatch = headers.find((header) => {
    const headerLower = header.title.toLowerCase();
    return (
      headerLower.includes(targetTitle) || targetTitle.includes(headerLower)
    );
  });
  if (partialMatch) return partialMatch.title;

  // Common variations for date
  if (targetTitle === 'date') {
    const dateVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('date') ||
        headerLower.includes('time') ||
        headerLower.includes('when') ||
        headerLower.includes('posted') ||
        headerLower.includes('transaction')
      );
    });
    if (dateVariations) return dateVariations.title;
  }

  // Common variations for description
  if (targetTitle === 'description') {
    const descVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('desc') ||
        headerLower.includes('narration') ||
        headerLower.includes('details') ||
        headerLower.includes('transaction') ||
        headerLower.includes('particulars') ||
        headerLower.includes('remarks')
      );
    });
    if (descVariations) return descVariations.title;
  }

  // Common variations for withdrawal
  if (targetTitle === 'withdrawal') {
    const withdrawalVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('withdrawal') ||
        headerLower.includes('debit') ||
        headerLower.includes('out') ||
        headerLower.includes('spent') ||
        (headerLower.includes('amount') && headerLower.includes('dr'))
      );
    });
    if (withdrawalVariations) return withdrawalVariations.title;
  }

  // Common variations for deposit
  if (targetTitle === 'deposit') {
    const depositVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('deposit') ||
        headerLower.includes('credit') ||
        headerLower.includes('in') ||
        headerLower.includes('received') ||
        (headerLower.includes('amount') && headerLower.includes('cr'))
      );
    });
    if (depositVariations) return depositVariations.title;
  }

  return undefined;
};

interface ParsedFileResult {
  fileData: FileRowData[];
  headers: Column[];
}

const parseFileData = (data: string[][]): ParsedFileResult => {
  const headers: Column[] = data[0].slice(1).map((header, index) => ({
    title: header,
    dataIndex: `column_${index}`,
    key: `column_${index}`,
  }));

  const parsedData: FileRowData[] = data
    .slice(1)
    .filter((row) => row.slice(1).some((cell) => cell && cell.trim() !== ''))
    .map((row, rowIndex) => {
      const cleanedRow = [];
      let tempValue = '';

      for (let i = 1; i < row.length; i++) {
        const cell = row[i].trim();

        if (cell.startsWith('"') && !cell.endsWith('"')) {
          tempValue = cell;
        } else if (!cell.startsWith('"') && cell.endsWith('"') && tempValue) {
          tempValue += `,${cell}`;
          cleanedRow.push(tempValue.replace(/["',]/g, ''));
          tempValue = '';
        } else if (tempValue) {
          tempValue += `,${cell}`;
        } else {
          cleanedRow.push(cell.replace(/,/g, ''));
        }
      }

      const processedRow = cleanedRow.reduce(
        (acc: FileRowData, val: string, colIndex: number) => {
          if (val && val.trim() !== '') {
            acc[`column_${colIndex}`] = val.trim();
          }
          return acc;
        },
        { key: `row_${rowIndex}` }
      );

      return Object.keys(processedRow).length > 1 ? processedRow : null;
    })
    .filter((row): row is FileRowData => row !== null);

  return {
    fileData: parsedData,
    headers: headers,
  };
};

const mapToExpenseData = (
  formData: FormData,
  fileData: FileRowData[],
  headers: Column[]
): ExpenseData[] => {
  return fileData
    ?.map((row) => {
      const descriptionColumnIndex = headers.findIndex(
        (col) => col.title === formData.Description
      );
      const withdrawalColumnIndex = headers.findIndex(
        (col) => col.title === formData.Withdrawal
      );
      const depositColumnIndex = headers.findIndex(
        (col) => col.title === formData.Deposit
      );
      const dateColumnIndex = headers.findIndex(
        (col) => col.title === formData.Date
      );

      const description = row[`column_${descriptionColumnIndex}`];
      const withdrawal = row[`column_${withdrawalColumnIndex}`];
      const deposit = row[`column_${depositColumnIndex}`];
      const date = row[`column_${dateColumnIndex}`];

      if (description && (withdrawal || deposit)) {
        const parsedWithdrawal = parseFloat(
          withdrawal?.replace(/[^\d.-]/g, '') || '0'
        );
        const parsedDeposit = parseFloat(
          deposit?.replace(/[^\d.-]/g, '') || '0'
        );

        if (!isNaN(parsedWithdrawal) || !isNaN(parsedDeposit)) {
          const parsedDate = moment.utc(date, 'DD/MM/YYYY', true);

          const payload = {
            description: description.trim(),
            withdrawal: parsedWithdrawal || 0,
            deposit: parsedDeposit || 0,
            transaction_date: parsedDate?.toDate() || new Date(),
          };
          return payload;
        }
      }
      return null;
    })
    .filter((item): item is ExpenseData => item !== null);
};

type StatementUploadContentProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

const StatementUploadContent: React.FC<StatementUploadContentProps> = ({
  setModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const [fileLink, setFileLink] = useState<File | null>(null);
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [fileData, setFileData] = useState<FileRowData[]>([]);
  const [headers, setHeaders] = useState<Column[]>([]);
  const [isFileProcessed, setIsFileProcessed] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: React.useMemo(() => {
      return targetColumns.reduce((acc, column) => {
        const match = findBestMatch(column.title, headers);
        if (match) {
          acc[column.title as keyof FormData] = match;
        }
        return acc;
      }, {} as FormData);
    }, [headers]),
  });

  const handleFileProcessing = (file: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const { fileData: parsedData, headers: parsedHeaders } = parseFileData(
        text.split('\n').map((line) => line.split(','))
      );
      setHeaders(parsedHeaders);
      setFileData(parsedData);
      setIsFileProcessed(true);
      setMediaUploadLoading(false);
    };
    if (!file) setMediaUploadLoading(false);
    reader.readAsText(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setMediaUploadLoading(true);
    setFileLink(file);
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 2MB');
        setMediaUploadLoading(false);
        return;
      }
      if (file.name.includes('csv')) {
        handleFileProcessing(file);
        return;
      }
    }
    setMediaUploadLoading(false);
    toast.error('Only CSV files are allowed!');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
  });

  const mutation = trpc.expenses.createBulkExpenses.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      toast.success('Expenses created successfully!', {
        duration: 4000,
      });
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expenses');
      setLoading(false);
    },
  });

  const onSubmit = (formData: FormData): void => {
    const mappedExpenses = mapToExpenseData(formData, fileData, headers);
    console.log({ mappedExpenses });

    setLoading(true);
    mutation.mutate(mappedExpenses);
  };

  const headerOptions = React.useMemo(
    () =>
      headers.map((header) => ({
        value: header.title,
        title: header.title,
      })),
    [headers]
  );

  const { translate } = useTranslation();

  return (
    <div className="mt-4">
      <h1 className="font-medium text-lg text-black mb-4">
        {isFileProcessed
          ? 'Review Mapped Fields'
          : translate('componentsExpenseModal.expense.uploadTitle')}
      </h1>
      {isFileProcessed ? (
        <div className="text-xs space-y-4">
          <p className="text-black font-medium mb-4">Selected File</p>
          <span className="text-[#5B52F9] bg-[#F0EFFE] font-medium px-3 rounded-lg py-2">
            {fileLink?.name}
          </span>
          <p className="text-[#71717A] font-medium">
            Fields have been auto-matched based on your CSV headers. Please
            review and adjust if needed.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            'rounded-lg mb-5 mt-2 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9]',
            fileLink === undefined && 'mb-2'
          )}
        >
          <div
            {...getRootProps()}
            className="h-full w-full flex items-center justify-center"
          >
            <DragAndDropFile
              type="csv"
              setFileLink={setFileLink}
              fileLink={fileLink}
              loading={mediaUploadLoading}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          </div>
        </div>
      )}

      {isFileProcessed && (
        <>
          <div className="grid grid-cols-2 gap-4 my-6">
            <p className="text-gray-400 border-b border-gray-200 text-xs pb-2">
              Required Field
            </p>
            <p className="text-gray-400 border-b border-gray-200 text-xs pb-2">
              CSV Column Headers
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {targetColumns.map((column, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4 space-y-2 items-center"
              >
                <p className="text-gray-800 text-xs pt-2 font-semibold">
                  {column.title}
                </p>
                <FormInput
                  name={column.title}
                  control={control}
                  type="select"
                  placeholder={column.title}
                  options={headerOptions}
                  required={column.title === 'Date' ? false : true}
                  defaultValue={findBestMatch(column.title, headers)}
                />
              </div>
            ))}
            <Button
              type="submit"
              className="w-full mt-7 text-white"
              variant="purple"
              disabled={loading || !isValid}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Statements Data
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default StatementUploadContent;
