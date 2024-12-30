'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/lib/TranslationProvider';
import { numberFormatter } from '@/utils/helpers/numberFormatter';

export type WriteOffs = {
  id: string;
  category: string;
  totalItemByCategory: number;
  amount: number;
};

export const WriteOffsTableColumns = (): ColumnDef<WriteOffs>[] => {
  const { translate } = useTranslation();
  return [
    {
      accessorKey: 'category',
      header: translate('page.WriteOffDataTableColumns.category'),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('category')}</div>
      ),
    },
    {
      accessorKey: 'totalItemByCategory',
      header: translate('page.WriteOffDataTableColumns.total'),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('totalItemByCategory')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: translate('page.WriteOffDataTableColumns.deduction'),
      cell: ({ row }) => (
        <div className="text-left my-1">
          {`NOK ${numberFormatter(row.original?.amount)}`}
        </div>
      ),
    },
  ];
};
