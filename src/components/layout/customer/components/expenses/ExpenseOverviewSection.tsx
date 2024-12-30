'use client';

import React, { useState } from 'react';
import ExpenseOverviewHeading from './ExpenseOverviewHeading';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { ExpenseDataTableColumns } from './ExpenseDataTableColumns';
import { trpc } from '@/utils/trpc';

type IFilterProps = {
  filterString: string;
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
};

function ExpenseOverviewSection({
  filterString,
  setFilterString,
}: IFilterProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { data: expensesResponse, isLoading } =
    trpc.expenses.getExpenses.useQuery(
      {
        page: currentPage,
        limit: pageLimit,
        searchTerm,
        filterString,
      },
      {
        keepPreviousData: true,
      }
    );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageLimitChange = (page: number) => {
    setPageLimit(page);
  };

  return (
    <div className="mt-3 rounded-2xl p-6 space-y-6 bg-white">
      <ExpenseOverviewHeading
        setSearchTerm={setSearchTerm}
        setFilterString={setFilterString}
      />
      <div className="space-y-6">
        <SharedDataTable
          loading={isLoading}
          columns={ExpenseDataTableColumns()}
          data={expensesResponse?.data || []}
        />
        <SharedPagination
          currentPage={currentPage}
          pageLimit={pageLimit}
          totalPages={expensesResponse?.pagination?.totalPages ?? 1}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
      </div>
    </div>
  );
}

export default ExpenseOverviewSection;
