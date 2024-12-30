'use client';
import { FC } from 'react';
import ArrowUp from '../../../../../../public/images/dashboard/arrow_up.svg';
import Image from 'next/image';
import SharedTooltip from '@/components/SharedTooltip';
import { Separator } from '@/components/ui/separator';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import { manipulatePersonalDeductions } from '@/utils/helpers/manipulatePersonalDeductions';
import SharedReportDownloader from '@/components/SharedReportDownloader';

export interface caregoryItem {
  title: string;
  predefinedCategories: {
    name: string;
    amount: number;
    reference_category?: string;
    threshold?: number;
  }[];
  total_amount: number;
  total_original_amount: number;
}

interface AggregatedExpenseCardProps {
  title?: string;
  items?: caregoryItem[];
  origin?: string;
}

const AggregatedExpenseCard: FC<AggregatedExpenseCardProps> = ({
  title,
  items,
  origin = 'business',
}) => {
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const personalData = manipulatePersonalDeductions(user?.questionnaires || []);

  const largestItem = (items ? items : personalData)?.reduce((prev, current) =>
    current.total_amount > prev.total_amount ? current : prev
  );
  const total =
    (items ? items : personalData)?.reduce(
      (sum, current) => sum + current.total_amount,
      0
    ) || 0;

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 w-full">
      <div className="flex justify-between ">
        <div>
          <h2 className="text-[13px] font-semibold text-[#627A97]">{title}</h2>
          <p className="text-2xl font-bold text-[#00104B]">
            NOK {numberFormatter(total)}
          </p>
        </div>
        {origin === 'personal' ? (
          <SharedReportDownloader
            body={personalData}
            origin="personal spending"
            total={total}
          />
        ) : (
          <SharedReportDownloader
            body={items}
            origin="business spending"
            total={total}
          />
        )}
      </div>

      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-4 bg-[#F6F6F6] rounded-2xl p-4">
          <div className="flex h-full flex-col space-y-4 justify-end ">
            <Image
              src={ArrowUp}
              alt="arrow_icon"
              height={25}
              width={25}
              className=""
            />

            <div className="">
              <p className="text-sm font-semibold text-[#71717A]">
                {largestItem?.title}
              </p>
              <p
                className={cn(
                  'text-lg font-bold mt-2 text-[#00104B]',
                  largestItem?.total_amount >= 0 && 'text-[#00104B]'
                )}
              >
                NOK{' '}
                {numberFormatter(Number(largestItem?.total_amount?.toFixed(2)))}{' '}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-2  h-[175px] overflow-y-auto pr-4 cursor-default ">
          {(items ? items : personalData)?.map(
            ({ title, total_amount, predefinedCategories }, index) =>
              origin === 'business' ? (
                <SharedTooltip
                  align="end"
                  key={index}
                  visibleContent={
                    <div className="flex items-center space-x-2 hover:bg-[#F6F6F6] p-2 rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-[#71717A]">
                          {title}
                        </p>
                        <p
                          className={cn(
                            'text-sm font-bold text-[#00104B]',
                            total_amount >= 0 && 'text-[#00104B]'
                          )}
                        >
                          NOK {numberFormatter(Number(total_amount.toFixed(2)))}{' '}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-2 w-[200px] py-1">
                    <h6 className="text-xs font-semibold text-[#627A97]">
                      {title}
                    </h6>
                    <Separator />
                    {predefinedCategories?.map(
                      ({ name, amount, reference_category }, i) => (
                        <div key={i} className="w-full space-y-1 mt-2">
                          <p className="text-xs font-semibold text-[#71717A]">
                            {name}
                          </p>
                          {reference_category && (
                            <small className="text-gray-600">
                              Ref: {reference_category}
                            </small>
                          )}
                          <div className="flex justify-between ">
                            <p className="text-xs font-bold text-[#00104B]">
                              NOK{' '}
                              {amount
                                ? numberFormatter(Number(amount?.toFixed(2)))
                                : 0}
                            </p>

                            {[
                              'Furniture and Equipment',
                              'Computer Hardware',
                            ].includes(
                              reference_category ? reference_category : name
                            ) && (
                              <p
                                className={`text-[10px] font-medium text-[#71717A]`}
                              >
                                Max NOK 15000
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </SharedTooltip>
              ) : (
                <div
                  key={index}
                  className="flex items-center space-x-2 hover:bg-[#F6F6F6] p-2 rounded-lg"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#71717A]">
                      {title}
                    </p>
                    <p
                      className={cn(
                        'text-sm font-bold text-[#00104B]',
                        largestItem?.total_amount >= 0 && 'text-[#00104B]'
                      )}
                    >
                      NOK {numberFormatter(Number(total_amount?.toFixed(2)))}{' '}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AggregatedExpenseCard;
