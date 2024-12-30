/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useCallback, useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { WriteOffsTableColumns } from './WriteOffsTableColumns';
import { trpc } from '@/utils/trpc';
import { debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';
import SharedReportDownloader from '@/components/SharedReportDownloader';

export default function WriteOffsTableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: writeOffs } = trpc.expenses.getWriteOffs.useQuery({
    page: currentPage,
    limit: pageLimit,
    searchTerm,
  });

  const { translate } = useTranslation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageLimitChange = (page: number) => {
    setPageLimit(page);
  };

  const debouncedSetSearchTerm = useCallback(debounce(setSearchTerm), [
    setSearchTerm,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };
  return (
    <div className="rounded-2xl mt-2 p-6 bg-white">
      <div className="flex justify-between items-center mb-4  ">
        <h2 className="text-xl text-[#101010] font-bold">
          {translate('page.writeoffoverview.title')}
        </h2>
        <div className="flex gap-2">
          <SearchInput
            className=""
            placeholder={translate(
              'page.search.write_off',
              'Search Write-offs'
            )}
            onChange={handleSearchChange}
          />
          <SharedReportDownloader
            body={writeOffs?.data}
            total={writeOffs?.data?.reduce(
              (sum: any, item: { amount: any }) => sum + item.amount,
              0
            )}
          />
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          columns={WriteOffsTableColumns()}
          data={writeOffs?.data || []}
        />
        <div className="mt-10">
          <SharedPagination
            currentPage={currentPage}
            pageLimit={pageLimit}
            totalPages={writeOffs?.pagination?.totalPages ?? 1}
            onPageChange={handlePageChange}
            onPageLimitChange={handlePageLimitChange}
          />
        </div>
      </div>
    </div>
  );
}
