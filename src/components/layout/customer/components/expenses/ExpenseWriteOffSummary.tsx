// import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { expenseWriteOffs } from '@/utils/dummy';
import React from 'react';
import ExpenseWriteOff from './ExpenseWriteOff';
import { Separator } from '@/components/ui/separator';

function ExpenseWriteOffSummary() {
  return (
    <div>
      <h1 className="font-bold text-xl text-[#5B52F9] mb-6">Your write-offs</h1>

      {expenseWriteOffs.map((item, index) => (
        <div key={item.id}>
          <ExpenseWriteOff
            id={item.id}
            title={item.title}
            value={item.amount}
            quantity={item.quantity}
          />
          {index === 5 && <Separator className="mb-5" />}
        </div>
      ))}

      <div className="py-3">
        <Button
          type="submit"
          className="w-full bg-[#F0EFFE] text-[#5B52F9] hover:bg-[#F0EFFE] mt-3"
        >
          Review deductions and questions
        </Button>
        <Button type="submit" className="w-full text-white mt-4">
          Import to tax return
        </Button>
      </div>
    </div>
  );
}

export default ExpenseWriteOffSummary;
