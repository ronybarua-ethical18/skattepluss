'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import CategoryAddModal from './CategoryAddModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import useUserInfo from '@/hooks/use-user-info';

export type Category = {
  _id: string;
  tile: string;
  created_by: 'SYSTEM' | 'USER';
  category_for: string;
};

type UpdateCategoryPayload = {
  _id: string;
  title?: string;
  reference_category?: string;
  category_for: 'expense' | 'income';
};

export const CategoryTableColumns = (): ColumnDef<Category>[] => {
  const { translate } = useTranslation();
  const { isAuditor } = useUserInfo();

  const columns: ColumnDef<Category>[] = [
    {
      header: translate(
        'page.CategoryDataTableColumns.serial_no',
        'Serial No.'
      ),
      cell: ({ row }) => {
        const serial_no = row.index + 1;
        return <div className="text-left pl-4">{`${serial_no}.`}</div>;
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.CategoryDataTableColumns.category', 'Category')}
          <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left pl-4">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'category_for',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {/* {translate('page.CategoryDataTableColumns.category', 'Category')} */}
          <>Category For</>
          <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left pl-4">
          {transformToUppercase(row.getValue('category_for'))}
        </div>
      ),
    },
    {
      accessorKey: 'created_by',
      header: translate(
        'page.CategoryDataTableColumns.created_by',
        'Created By'
      ),
      cell: ({ row }) => (
        <div className="text-left text-xs pl-4 font-medium text-[#00104B] my-1">
          {row.getValue('created_by')}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div
          className={`flex space-x-0 items-center ${row?.original?.created_by === 'SYSTEM' ? 'opacity-30 pointer-events-none' : ''}`}
        >
          <CategoryAddModal
            origin="category table"
            category={row?.original as UpdateCategoryPayload}
          />
          <SharedDeleteActionCell
            itemId={row.original._id as string}
            itemOrigin="category"
          />
        </div>
      ),
    },
  ];
  return isAuditor ? columns.filter((col) => col.id !== 'actions') : columns;
};
