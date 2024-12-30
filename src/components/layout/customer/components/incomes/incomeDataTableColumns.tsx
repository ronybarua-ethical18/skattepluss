'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import formatDate from '@/utils/helpers/formatDate';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import { useTranslation } from '@/lib/TranslationProvider';
import IncomeDetailsModal from './IncomeDetailsModal';
import IncomeUpdateModal from './IncomeUpdateModal';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import useUserInfo from '@/hooks/use-user-info';

export type IncomeColumnProps = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  income_type: string;
  amount: number;
};

export const IncomeDataTableColumns = (): ColumnDef<IncomeColumnProps>[] => {
  const { translate } = useTranslation();
  const { isAuditor } = useUserInfo();

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="border border-[#E4E4E7] shadow-none rounded-none  data-[state=checked]:text-white"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="border border-[#E4E4E7] shadow-none rounded-none  data-[state=checked]:text-white"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'transaction_date',
      header: translate('page.incomeDataTableColumns.date', 'Date'),
      cell: ({ row }) => {
        const transactionDate = row.getValue('transaction_date') as string;
        const createdAt = row.original.createdAt;
        const dateToRender = transactionDate || createdAt || '';
        return (
          <span className="text-[#00104B]">{formatDate(dateToRender)}</span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: translate(
        'page.incomeDataTableColumns.description',
        'Description'
      ),
      cell: ({ row }) => (
        <span className="text-[#00104B]">{row.getValue('description')}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.incomeDataTableColumns.category', 'Category')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('category'))}</span>
      ),
    },
    {
      accessorKey: 'income_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.incomeDataTableColumns.type', 'Type')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('income_type'))}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.incomeDataTableColumns.amount', 'Amount')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const amountToRender = row.getValue('amount') as number;
        return (
          <span className="text-[#00104B]">
            {`NOK ${numberFormatter(amountToRender)}`}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <div className="my-2">
            <IncomeDetailsModal payload={row.original} />
          </div>
          {!isAuditor && (
            <>
              <IncomeUpdateModal payload={row.original} />
              <SharedDeleteActionCell
                itemOrigin="income"
                itemId={row.original._id as string}
              />
            </>
          )}
        </div>
      ),
    },
  ];
};
