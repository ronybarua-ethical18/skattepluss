'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CircularProgressChart from './CircularProgressChart';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { manipulatePersonalDeductions } from '@/utils/helpers/manipulatePersonalDeductions';
import { trpc } from '@/utils/trpc';

const DeductiveExpenses = ({
  businessData,
}: {
  businessData: { total_amount: number }[];
}) => {
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const personalData = manipulatePersonalDeductions(user?.questionnaires);

  const personalTotal = personalData?.reduce(
    (sum, current) => sum + current.total_amount,
    0
  );
  const businessTotal = businessData?.reduce(
    (sum, current) => sum + current.total_amount,
    0
  );
  const totalDeductibleAmount = businessTotal + personalTotal || 0;
  return (
    <Card className="col-span-6 py-6 px-[21px] border border-[#EEF0F4] shadow-none rounded-2xl">
      <CardContent className="p-0">
        <div className=" ">
          <div className="flex justify-between">
            <h4 className="text-sm  text-[#627A97] font-semibold">
              Total <span className="text-nowrap">write-offs</span>
            </h4>
            <Badge className="bg-[#F0EFFE] px-1 text-nowrap max-h-[22px]  hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium">
              This year
            </Badge>
          </div>
          <p className="text-[28px] text-[#00104B] font-bold">
            NOK {numberFormatter(totalDeductibleAmount) || 0}
          </p>
        </div>

        <div className="mt-4 space-y-2 ">
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] py-2 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                Bussiness
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Savings from
              </span>
            </div>
            <CircularProgressChart
              series={[
                Math.round((businessTotal / totalDeductibleAmount) * 100) || 0,
              ]}
            />
          </div>
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] py-2 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                Personal
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Savings from
              </span>
            </div>
            <CircularProgressChart
              color="#F99BAB"
              trackBg="#F99BAB5E"
              series={[
                Math.round((personalTotal / totalDeductibleAmount) * 100) || 0,
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductiveExpenses;
