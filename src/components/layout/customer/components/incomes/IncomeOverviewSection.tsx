'use client';

import React, { useState } from 'react';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { trpc } from '@/utils/trpc';
import IncomeOverviewTools from './IncomeOverviewTools';
import { IncomeDataTableColumns } from './incomeDataTableColumns';

type IFilterProps = {
  filterString: string;
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
};

function IncomeOverviewSection({
  filterString,
  setFilterString,
}: IFilterProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { data: incomesResponse, isLoading } = trpc.incomes.getIncomes.useQuery(
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
      <IncomeOverviewTools
        setSearchTerm={setSearchTerm}
        setFilterString={setFilterString}
      />
      <div className="space-y-6">
        <SharedDataTable
          loading={isLoading}
          columns={IncomeDataTableColumns()}
          data={incomesResponse?.data || []}
        />
        <SharedPagination
          currentPage={currentPage}
          pageLimit={pageLimit}
          totalPages={incomesResponse?.pagination?.totalPages ?? 1}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
      </div>
    </div>
  );
}

export default IncomeOverviewSection;
