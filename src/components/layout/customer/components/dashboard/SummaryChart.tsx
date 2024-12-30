'use client';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Handshake, SquareUserRound } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ExpenseCategory {
  title: string;
  total_amount: number;
}

const SummaryChart = ({
  expenses,
  showPersonal,
  setShowPersonal,
}: {
  expenses: ExpenseCategory[];
  showPersonal: 'personal' | 'business';
  setShowPersonal: React.Dispatch<
    React.SetStateAction<'personal' | 'business'>
  >;
}) => {
  const isMax1500: boolean = useMediaQuery('(max-width: 1500px)');
  const colorPalette = [
    '#9F97F7',
    '#FFB44F',
    '#F99BAB',
    '#9BDFC4',
    '#62B2FD',
    '#6EC1E4',
  ];

  // Calculate total amount
  const totalAmount = expenses?.reduce(
    (sum, expense) => sum + expense.total_amount,
    0
  );

  // Prepare chart series and labels
  const chartSeries = expenses?.map((expense) => expense.total_amount) || [];
  const chartLabels = expenses?.map((expense) => expense.title) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: any = {
    chart: {
      type: 'donut' as const,
    },
    labels: chartLabels,
    colors: colorPalette.slice(0, expenses?.length),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false, // Hide legend
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontWeight: 600,
              color: '#1F2937',
              offsetY: 5,
            },
            value: {
              show: true,
              fontSize: '19px',
              fontWeight: 600,
              color: '#000',
              formatter: (val: number) => `NOK ${val?.toLocaleString()}`,
            },
            total: {
              show: true,
              label: false,
              fontSize: '19px',
              fontWeight: 600,
              color: '#1F2937',
              formatter: () =>
                `NOK ${totalAmount ? totalAmount?.toLocaleString() : 0}`,
            },
          },
        },
      },
      expandOnClick: false,
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `NOK ${val.toLocaleString()}`,
      },
    },
  };

  return (
    <div className="col-span-6 space-y-6 p-6 bg-white rounded-2xl border border-[#EEF0F4] shadow-none">
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-[#71717A]">Summary</h3>
            <p className="text-[#71717A] text-xs">Write-offs Breakdown</p>
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
        <div className="flex justify-center">
          <Chart
            options={chartOptions}
            height={isMax1500 ? 190 : 208}
            width={isMax1500 ? 190 : 208}
            series={chartSeries}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryChart;
