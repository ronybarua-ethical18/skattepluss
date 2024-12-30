'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import ExpenseDetailsModal from '../expenses/ExpenseDetailsModal';
import ExpenseUpdateModal from '../expenses/ExpenseUpdateModal';
import formatDate from '@/utils/helpers/formatDate';
import useUserInfo from '@/hooks/use-user-info';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
};

export const YearlyExpenseTableColumns = (): ColumnDef<Expense>[] => {
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
      size: 200,
    },
    {
      accessorKey: 'transaction_date',
      header: 'Date',
      cell: ({ row }) => {
        const transactionDate = row.getValue('transaction_date') as string;
        const createdAt = row.original.createdAt;
        const dateToRender = transactionDate || createdAt || '';
        return (
          <div className="w-[100px]">
            <span className="text-[#00104B]">{formatDate(dateToRender)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Expense description',
      cell: ({ row }) => (
        <div className="w-[250px]">{row.getValue('description')}</div>
      ), // Center aligned
      size: 100, // Adjust column size
      minSize: 100,
      maxSize: 200,
    },
    {
      accessorKey: 'expense_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Expense type
          <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue('expense_type')}</div>
      ), // Center aligned
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => <div className="pl-4">{row.getValue('category')}</div>, // Center aligned
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-left">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatToNOK = (amount: number) => {
          const formatted = new Intl.NumberFormat('nb-NO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);

          return `NOK ${formatted}`;
        };

        return (
          <div className="text-left font-medium w-[150px]">
            {formatToNOK(amount)}
          </div>
        ); // Center aligned
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="w-full">
          <div className="flex items-center space-x-1">
            <ExpenseDetailsModal payload={row.original} />
            {!isAuditor && <ExpenseUpdateModal payload={row.original} />}
          </div>
        </div>
      ),
    },
  ];
};
