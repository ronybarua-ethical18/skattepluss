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
  expense_type: string;
  category_title: string;
  category: string;
  user: string;
};

type ExpensePayloadType = {
  expense_type: string;
  category: string;
  rule: string;
};

type ExpenseType = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  expense_type: string;
};

type ExpenseWithRulesType = {
  expenses: ExpenseType[];
  expensePayload: ExpensePayloadType;
  rule: string;
};

interface ExpenseRuleContentProps {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  expenses: {
    expensesWithRules: ExpenseWithRulesType[];
    rules: RuleType[];
  };
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

function ApplyRuleModalContent({
  expenses: { expensesWithRules },
  setModalOpen,
}: ExpenseRuleContentProps) {
  const { translate } = useTranslation(); // Translation hook
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string>(
    expensesWithRules[0]?.rule || ''
  );
  const [tableData, setTableData] = useState<ExpenseType[]>([]);
  const [deletedExpenseIds, setDeletedExpenseIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const selectedRuleData = expensesWithRules.find(
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

  const mutation = trpc.expenses.updateBulkExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      toast.success(translate('applyRuleModal.toast.success'));
      setLoading(false);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || translate('applyRuleModal.toast.error'));
    },
  });

  const handleDelete = (expenseId: string) => {
    setDeletedExpenseIds((prev) => [...prev, expenseId]);
    setTableData((prev) => prev.filter((expense) => expense._id !== expenseId));
  };

  const handleApplyRule = () => {
    setLoading(true);
    console.log(
      'incomes before applying rule',
      selectedRuleData?.expensePayload
    );
    if (selectedRuleData?.expensePayload) {
      const expenses =
        tableData
          ?.filter((expense) => !deletedExpenseIds.includes(expense._id))
          .map((expense) => ({
            _id: expense._id,
            expenseUpdatePayload: selectedRuleData.expensePayload,
          })) || [];

      if (expenses.length === 0) {
        toast.error(translate('applyRuleModal.toast.noExpenses'));
        setLoading(false);
        return;
      }

      mutation.mutate({ expenses });
    }
  };

  useEffect(() => {
    if (selectedRuleData?.expenses) {
      setTableData(selectedRuleData.expenses);
      setCurrentPage(1);
    }
  }, [selectedRuleData]);

  return (
    <div className="space-y-8">
      <h1 className="font-medium text-xl text-[#000] mt-6 mb-8">
        {translate('applyRuleModal.title')}
      </h1>
      <div className="flex flex-wrap gap-2">
        {expensesWithRules.map((expenseRule) => (
          <Badge
            key={expenseRule.rule}
            className={`rounded-[28px] py-1 cursor-pointer ${
              selectedRule === expenseRule.rule
                ? 'bg-[#5B52F9] text-white'
                : 'bg-[#EEF0F4] text-[#5B52F9]'
            }`}
            onClick={() => handleRuleClick(expenseRule.rule)}
          >
            {expenseRule.rule}{' '}
            <span className="ms-1">({expenseRule.expenses.length})</span>
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
