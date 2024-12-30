import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { trpc } from '@/utils/trpc';
import { chartItemsManipulation } from '@/utils/helpers/expenseChartItemsManipulation';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const IncomeStats: React.FC<{ title: string; filterString?: string }> = ({
  title,
  filterString,
}) => {
  const { data: analytics } =
    trpc.incomes.getBusinessAndPersonalIncomeAnalytics.useQuery({
      income_type: '',
      filterString,
    });

  const businessIncomeAnalytics = analytics?.data?.businessIncomeAnalytics;
  const personalIncomeAnalytics = analytics?.data?.personalIncomeAnalytics;
  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const { manipulateWeekDays, chartItemsByExpenseType } =
    chartItemsManipulation(
      title,
      weekDays,
      businessIncomeAnalytics as unknown as any,
      personalIncomeAnalytics as unknown as any
    );

  const chartOptions = {
    series: [
      {
        name: 'Transactions',
        data: chartItemsByExpenseType || [0],
      },
    ] as ApexAxisChartSeries,
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: true,
          speed: 200,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 2,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: manipulateWeekDays,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
        crosshairs: {
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
        min: 0,
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        y: {
          formatter: function (value: number) {
            return `NOK ${value.toLocaleString()}`;
          },
        },
        custom: function ({
          series,
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          series: number[][];
          seriesIndex: number;
          dataPointIndex: number;
          w: unknown;
        }) {
          const value = series[seriesIndex][dataPointIndex];
          // @ts-expect-error: Suppress type checking for w
          const day = w.globals.labels[dataPointIndex];

          return `<div class="custom-tooltip shadow-md" style="padding: 8px;">
            <h1 style="color: #fff">${day}</h1>
            <span style="color: #fff">NOK ${value.toLocaleString()}</span>
          </div>`;
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9,
          },
        },
      },
      title: {
        text: undefined,
      },
      colors: title === 'Business' ? ['#00B386'] : ['#F99BAB'],
    },
  } as { series: ApexAxisChartSeries; options: ApexOptions };

  return (
    <ReactApexChart
      options={chartOptions.options}
      series={chartOptions.series}
      type="bar"
      height={60}
      width={120}
    />
  );
};

export default IncomeStats;
