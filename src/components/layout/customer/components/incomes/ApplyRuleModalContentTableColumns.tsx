/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import SharedTooltip from '@/components/SharedTooltip';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from '@/lib/TranslationProvider'; // Import translation hook

export type ExpenseColumnProps = { [x: string]: any; [x: number]: any };

export const ApplyRuleModalContentTableColumns = (
  onDelete: (id: string) => void
): ColumnDef<ExpenseColumnProps>[] => {
  const { translate } = useTranslation(); // Use translation hook

  return [
    {
      accessorKey: 'description',
      header: translate('componentsApplyRuleModal.table.description'),
      cell: ({ row }) => {
        return (
          <span className="text-[#00104B]">{row.getValue('description')}</span>
        );
      },
    },
    {
      accessorKey: 'category',
      header: translate('componentsApplyRuleModal.table.category'),
      cell: ({ row }) => {
        return (
          <span className="text-[#00104B]">{row.getValue('category')}</span>
        );
      },
    },
    {
      accessorKey: 'expense_type',
      header: translate('componentsApplyRuleModal.table.type'),
      cell: ({ row }) => {
        return (
          <span className="text-[#00104B]">{row.getValue('expense_type')}</span>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: translate('componentsApplyRuleModal.table.amount'),
      cell: ({ row }) => {
        const amount_to_render = row.getValue('amount') as number;
        return (
          <span className="text-[#00104B]">
            <NumericFormat
              value={amount_to_render}
              displayType="text"
              thousandSeparator={true}
              prefix="NOK "
            />
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <SharedTooltip
            align="end"
            visibleContent={
              <Button
                className="h-6 w-16 text-red-500 bg-white shadow-none border-none hover:bg-white"
                onClick={() => onDelete(row.original._id as string)}
              >
                {translate('componentsApplyRuleModal.table.actions.remove')}
              </Button>
            }
          >
            <div className="w-36">
              {translate('componentsApplyRuleModal.table.actions.tooltip')}
            </div>
          </SharedTooltip>
        </div>
      ),
    },
  ];
};
