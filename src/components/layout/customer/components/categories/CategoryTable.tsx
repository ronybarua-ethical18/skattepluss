'use client';
import React, { useMemo, useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import { CategoryTableColumns } from './CategoryTableColumns';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import CategoryAddModal from './CategoryAddModal';
import { trpc } from '@/utils/trpc';
import { debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import useUserInfo from '@/hooks/use-user-info';

export type FormData = {
  title: string;
  category_for: 'expense' | 'income';
};
export default function CategoryTable() {
  const { isAuditor } = useUserInfo();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { translate } = useTranslation();
  const [pageLimit, setPageLimit] = useState(50);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>(
    'all'
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageLimitChange = (page: number) => {
    setPageLimit(page);
  };

  const { data } = trpc.categories.getCategories.useQuery(
    {
      page: currentPage,
      limit: pageLimit,
      searchTerm,
      category_for: activeTab === 'all' ? undefined : activeTab,
    },
    {
      keepPreviousData: true,
    }
  );

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value)),
    [setSearchTerm]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | 'income' | 'expense');
    setCurrentPage(1);
  };

  return (
    <div className="rounded-2xl p-6 bg-white">
      <h2 className="text-xl text-[#101010] font-bold">
        {translate(
          'page.CategoryDataTableColumns.overview',
          'Category Overview'
        )}
      </h2>
      <Tabs
        value={activeTab.toString()}
        onValueChange={handleTabChange}
        className="mt-4"
      >
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto space-x-6">
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value="all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value="income"
            >
              Income{' '}
              <div className="bg-violet-100 px-[6px] text-red ml-2 rounded-md">
                <h5 className="text-[10px] text-violet-600 font-semibold">
                  {data?.totals?.totalIncomeCategories || 0}
                </h5>
              </div>
            </TabsTrigger>
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value="expense"
            >
              Expense{' '}
              <div className="bg-red-100 px-[6px] text-red ml-2 rounded-md">
                <h5 className="text-[10px] text-red-500 font-semibold">
                  {data?.totals?.totalExpenseCategories || 0}
                </h5>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex justify-between items-center py-4 mt-2">
          <SearchInput
            className=""
            onChange={handleSearchChange}
            placeholder={translate(
              'page.CategoryDataTableColumns.search',
              'Search category'
            )}
          />
          {!isAuditor && (
            <div className="z-50">
              <CategoryAddModal />
            </div>
          )}
        </div>
        <TabsContent value="all">
          <div className=" ">
            <SharedDataTable
              className="min-h-[500px]"
              columns={CategoryTableColumns()}
              data={data?.data ?? []}
            />
            <div className="mt-10">
              <SharedPagination
                currentPage={currentPage}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={handlePageChange}
                pageLimit={pageLimit}
                onPageLimitChange={handlePageLimitChange}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="income">
          <div className="mt-10">
            <SharedDataTable
              className="min-h-[500px]"
              columns={CategoryTableColumns()}
              data={data?.data ?? []}
            />
            <div className="mt-10">
              <SharedPagination
                currentPage={currentPage}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={handlePageChange}
                pageLimit={pageLimit}
                onPageLimitChange={handlePageLimitChange}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="expense">
          <div className="mt-10">
            <SharedDataTable
              className="min-h-[500px]"
              columns={CategoryTableColumns()}
              data={data?.data ?? []}
            />
            <div className="mt-10">
              <SharedPagination
                currentPage={currentPage}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={handlePageChange}
                pageLimit={pageLimit}
                onPageLimitChange={handlePageLimitChange}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
