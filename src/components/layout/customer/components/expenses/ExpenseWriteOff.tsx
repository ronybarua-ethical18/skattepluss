import React from 'react';

type ExpenseWriteOffProps = {
  id: number;
  title: string;
  value: string | number;
  quantity: number | string;
};

const ExpenseWriteOff: React.FC<ExpenseWriteOffProps> = ({
  id,
  title,
  value,
  quantity,
}) => {
  return (
    <div className="flex justify-between mb-5">
      <h2 className="text-base">
        {typeof quantity === 'number' && quantity > 1
          ? `${title} (${quantity})`
          : title}
      </h2>
      <h3
        className={`${id > 6 ? 'text-xl font-semibold text-[#00B386]' : 'text-base'}`}
      >
        {value}
      </h3>
    </div>
  );
};

export default ExpenseWriteOff;
