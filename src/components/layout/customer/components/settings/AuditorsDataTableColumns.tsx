/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';

export const AuditorsDataTableColumns = (): ColumnDef<any>[] => {
  return [
    {
      accessorKey: 'serialNo',
      header: 'Serial',
      cell: ({ row }) => <div className="text-left pl-4">{row.index + 1}.</div>,
    },
    {
      accessorKey: 'auditor_email',
      header: 'Auditor Email',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('auditor_email')}</div>
      ),
    },
    {
      header: 'First Name',
      cell: ({ row }) => (
        <div className="text-left">
          {row.original?.auditor?.lastName || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({ row }) => (
        <div className="text-left">
          {row.original?.auditor?.lastName || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={`text-left ${row?.original?.status === 'verified' ? 'text-green-600' : 'text-orange-500'} font-medium my-1`}
        >
          {transformToUppercase(row.getValue('status'))}
        </div>
      ),
    },
    // {
    //   id: 'actions',
    //   header: 'Action',
    //   cell: ({ row }) => (
    //     <SharedDeleteActionCell
    //       itemId={row.original._id as string}
    //       itemOrigin="auditor"
    //     />
    //   ),
    // },
  ];
};
