'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { Handshake, SquareUserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/TranslationProvider';
import { trpc } from '@/utils/trpc';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type IncomeAnalytics = {
  month: string;
  totalAmount: number;
  totalItems: number;
};

type IncomesAnalyticsData = {
  personalIncomeAnalytics: IncomeAnalytics[];
  businessIncomeAnalytics: IncomeAnalytics[];
};

const YearlyIncomeGraph = () => {
  const [showPersonal, setShowPersonal] = useState<'business' | 'personal'>(
    'business'
  );
  const { translate } = useTranslation();

  const { data: incomesAnalytics } =
    trpc.incomes.getBusinessAndPersonalincomeYearly.useQuery({
      income_type: '',
    });

  const processAnalyticsData = (analytics: IncomeAnalytics[]) => {
    const monthsOrder = [
      '2024-07',
      '2024-08',
      '2024-09',
      '2024-10',
      '2024-11',
      '2023-12',
      '2024-01',
      '2024-02',
      '2024-03',
      '2024-04',
      '2024-05',
      '2024-06',
    ];

    return monthsOrder.map((month) => {
      const found = analytics?.find(
        (item: IncomeAnalytics) => item.month === month
      );
      return found ? found.totalAmount : 0;
    });
  };

  const incomesAnalyticsData = incomesAnalytics?.data as
    | IncomesAnalyticsData
    | undefined;

  const personalExpenseData = processAnalyticsData(
    incomesAnalyticsData?.personalIncomeAnalytics ?? []
  );
  const businessExpenseData = processAnalyticsData(
    incomesAnalyticsData?.businessIncomeAnalytics ?? []
  );

  const getOptions = (isPersonal: boolean): ApexOptions => ({
    chart: { toolbar: { show: false }, animations: { enabled: true } },
    stroke: {
      curve: 'smooth',
      colors: isPersonal ? ['#FFAFA3'] : ['#7549FF'],
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        gradientToColors: ['rgba(241, 237, 255, 0)'],
        shadeIntensity: 0,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: isPersonal ? '#FFE4E0' : '#F3F0FF', opacity: 1 },
          { offset: 100, color: 'rgba(241, 237, 255, 0)', opacity: 0 },
        ],
      },
    },
    dataLabels: { enabled: false },
    grid: { show: false },
    xaxis: {
      categories: [
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
      ],
      tickPlacement: 'on',
      axisTicks: { show: true },
      axisBorder: { show: true, color: '#EEF0F4' },
      labels: { style: { fontSize: '8.447px', colors: '#71717A' } },
    },
    yaxis: {
      min: 0,
      max: Math.max(...personalExpenseData, ...businessExpenseData),
      tickAmount: 5,
      axisTicks: { show: true },
      axisBorder: { show: true, color: '#EEF0F4' },
      labels: {
        formatter: (val: number) => `NOK ${Number((val / 1000).toFixed(2))}k`,
        style: { fontSize: '8.447px', colors: '#71717A' },
      },
    },
  });

  const personalSeries = [
    {
      name: 'Personal Expense',
      data: personalExpenseData,
    },
  ];

  const businessSeries = [
    {
      name: 'Business Expense',
      data: businessExpenseData,
    },
  ];

  return (
    <Card className="col-span-6 mt-2 border border-[#EEF0F4] flex flex-col justify-between shadow-none pt-4 px-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg text-[#101010] font-semibold">
            Annual Income Chart
          </h2>
          <p className="text-xs text-[#71717A]">
            {translate('page.dashboard.subTitle')}
          </p>
        </div>
        <div className="flex">
          <button
            onClick={() => setShowPersonal('business')}
            className={`w-[40px] h-[30px] flex justify-center items-center rounded ${
              showPersonal === 'business'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <Handshake
              className={`${showPersonal === 'business' ? 'text-white' : 'text-[#5B52F9]'}`}
            />
          </button>
          <button
            onClick={() => setShowPersonal('personal')}
            className={`w-[40px] h-[30px] flex justify-center items-center rounded ${
              showPersonal === 'personal'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <SquareUserRound
              className={`${showPersonal === 'personal' ? 'text-white' : 'text-[#5B52F9]'}`}
            />
          </button>
        </div>
      </div>

      {incomesAnalyticsData && (
        <ApexChart
          key={showPersonal}
          options={getOptions(showPersonal === 'personal')}
          series={showPersonal === 'business' ? businessSeries : personalSeries}
          type="area"
          height={231}
        />
      )}
    </Card>
  );
};

export default YearlyIncomeGraph;
