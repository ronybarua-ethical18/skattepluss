import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SharedDataTable } from '@/components/SharedDataTable';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { ApplyRuleModalContentTableColumns } from './ApplyRuleModalContentTableColumns';
import SharedPagination from '@/components/SharedPagination';
import { useTranslation } from '@/lib/TranslationProvider'; // Translation hook

type CategoryType = { title: string; value: string };

export type RuleType = {
  _id: string;
  description_contains: string;
  income_type: string;
  category_title: string;
  category: string;
  user: string;
};

type IncomePayloadType = {
  income_type: string;
  category: string;
  rule: string;
};

type IncomeType = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  income_type: string;
};

type IncomeWithRulesType = {
  incomes: IncomeType[];
  incomePayload: IncomePayloadType;
  rule: string;
};

interface IncomeRuleContentProps {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  incomes: {
    incomesWithRules: IncomeWithRulesType[];
    rules: RuleType[];
  };
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

function ApplyRuleModalContent({
  incomes: { incomesWithRules },
  setModalOpen,
}: IncomeRuleContentProps) {
  const { translate } = useTranslation(); // Translation hook
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string>(
    incomesWithRules[0]?.rule || ''
  );
  const [tableData, setTableData] = useState<IncomeType[]>([]);
  const [deletedIncomeIds, setDeletedIncomeIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const selectedRuleData = incomesWithRules.find(
    (exp) => exp.rule === selectedRule
  );

  const utils = trpc.useUtils();

  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / pageLimit);
  const startIndex = (currentPage - 1) * pageLimit;
  const endIndex = Math.min(startIndex + pageLimit, totalItems);
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handleRuleClick = (rule: string) => {
    setSelectedRule(rule);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageLimitChange = (limit: number) => {
    setPageLimit(limit);
    setCurrentPage(1);
  };

  const mutation = trpc.incomes.updateBulkIncome.useMutation({
    onSuccess: () => {
      utils.incomes.getIncomes.invalidate();
      utils.incomes.getCategoryAndIncomeTypeWiseIncomes.invalidate();

      toast.success('Incomes updated successfully');
      setLoading(false);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || translate('applyRuleModal.toast.error'));
    },
  });

  const handleDelete = (IncomeId: string) => {
    setDeletedIncomeIds((prev) => [...prev, IncomeId]);
    setTableData((prev) => prev.filter((Income) => Income._id !== IncomeId));
  };

  const handleApplyRule = () => {
    setLoading(true);
    console.log(
      'incomes before applying rule',
      selectedRuleData?.incomePayload
    );
    if (selectedRuleData?.incomePayload) {
      const incomes =
        tableData
          ?.filter((income) => !deletedIncomeIds.includes(income._id))
          .map((income) => ({
            _id: income._id,
            incomeUpdatePayload: selectedRuleData.incomePayload,
          })) || [];

      if (incomes.length === 0) {
        toast.error(translate('applyRuleModal.toast.noincomes'));
        setLoading(false);
        return;
      }

      mutation.mutate({ incomes });
    }
  };

  useEffect(() => {
    if (selectedRuleData?.incomes) {
      setTableData(selectedRuleData.incomes);
      setCurrentPage(1);
    }
  }, [selectedRuleData]);

  console.log('income table data', tableData);

  return (
    <div className="space-y-8">
      <h1 className="font-medium text-xl text-[#000] mt-6 mb-8">
        {translate('applyRuleModal.title')}
      </h1>
      <div className="flex flex-wrap gap-2">
        {incomesWithRules.map((incomeRule) => (
          <Badge
            key={incomeRule.rule}
            className={`rounded-[28px] py-1 cursor-pointer ${
              selectedRule === incomeRule.rule
                ? 'bg-[#5B52F9] text-white'
                : 'bg-[#EEF0F4] text-[#5B52F9]'
            }`}
            onClick={() => handleRuleClick(incomeRule.rule)}
          >
            {incomeRule.rule}{' '}
            <span className="ms-1">({incomeRule.incomes.length})</span>
          </Badge>
        ))}
      </div>

      <SharedDataTable
        className="max-h-[250px]"
        columns={ApplyRuleModalContentTableColumns(handleDelete)}
        data={paginatedData}
      />

      <SharedPagination
        justifyEnd
        currentPage={currentPage}
        pageLimit={pageLimit}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageLimitChange={handlePageLimitChange}
      />

      <Button
        disabled={loading}
        onClick={handleApplyRule}
        type="button"
        className="w-full text-white"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {translate('applyRuleModal.button.apply')}
      </Button>
    </div>
  );
}

export default ApplyRuleModalContent;
