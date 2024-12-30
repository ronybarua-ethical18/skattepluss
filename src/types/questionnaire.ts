export type Questionnaire = {
  question: string;
  answers: string[];
};

export type AccordionItemData = {
  id: string;
  title: string;
  content: React.ReactNode | string;
};

export type UpdateRuleProps = {
  _id: string;
  description_contains: string;
  category: string;
  category_title: string;
  expense_type: 'business' | 'personal';
  rule_for: 'expense' | 'income';
};
