/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';

export const CustomersDataTableColumns = (): ColumnDef<any>[] => {
  return [
    {
      accessorKey: 'serialNo',
      header: 'Serial',
      cell: ({ row }) => <div className="text-left pl-4">{row.index + 1}.</div>,
    },
    {
      accessorKey: 'customer_email',
      header: 'Customer Email',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('customer_email')}</div>
      ),
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('first_name')}</div>
      ),
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('last_name')}</div>
      ),
    },
  ];
};
