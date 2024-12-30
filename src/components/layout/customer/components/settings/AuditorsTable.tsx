import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { AuditorsDataTableColumns } from './AuditorsDataTableColumns';
import { trpc } from '@/utils/trpc';

const AuditorsTable = () => {
  const { data: auditorsOrCustomers } =
    trpc.auditor.getAuditorsOrCustomers.useQuery(
      {
        page: 1,
        limit: 10,
      },
      {
        keepPreviousData: true,
      }
    );

  console.log('auditorsOrCustomers', auditorsOrCustomers);

  return (
    <div className=" ">
      <SharedDataTable
        className=" "
        columns={AuditorsDataTableColumns()}
        data={auditorsOrCustomers?.data || []}
      />
    </div>
  );
};

export default AuditorsTable;
