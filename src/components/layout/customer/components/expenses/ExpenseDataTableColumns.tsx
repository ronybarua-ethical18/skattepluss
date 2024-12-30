'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import formatDate from '@/utils/helpers/formatDate';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import ExpenseUpdateModal from './ExpenseUpdateModal';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import useUserInfo from '@/hooks/use-user-info';

export type ExpenseColumnProps = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
};

export const ExpenseDataTableColumns = (): ColumnDef<ExpenseColumnProps>[] => {
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
      header: translate('page.expenseDataTableColumns.date', 'Date'),
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
        'page.expenseDataTableColumns.description',
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
          {translate('page.expenseDataTableColumns.category', 'Category')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('category'))}</span>
      ),
    },
    {
      accessorKey: 'expense_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.expenseDataTableColumns.type', 'Type')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('expense_type'))}</span>
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
          {translate('page.expenseDataTableColumns.amount', 'Amount')}{' '}
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
          <div className={`my-2`}>
            <ExpenseDetailsModal payload={row.original} />
          </div>
          {!isAuditor && (
            <>
              <ExpenseUpdateModal payload={row.original} />
              <SharedDeleteActionCell
                itemOrigin="expense"
                itemId={row.original._id as string}
              />
            </>
          )}
        </div>
      ),
    },
  ];
};
