/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '../../public/skatterpluss_logo_for_pdf.png';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { Badge } from './ui/badge';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import useUserInfo from '@/hooks/use-user-info';

type BodyItem = {
  category?: string;
  title?: string;
  name?: string;
  amount?: number;
  total_amount?: number;
  totalItemByCategory?: number;
} & Record<string, any>;

interface SharedReportDownloaderProps {
  body: BodyItem[] | undefined;
  total: number;
  origin?: string;
  fullWidth?: boolean;
}

export default function SharedReportDownloader({
  body,
  total,
  origin = 'write off section',
  fullWidth,
}: SharedReportDownloaderProps) {
  const { data: user } = trpc.users.getUserByEmail.useQuery();
  const { isAuditor } = useUserInfo();
  const isGreaterThan1600: boolean = useMediaQuery('(min-width: 1601px)');
  const generatePDFWithImage = async () => {
    const doc = new jsPDF();

    try {
      const convertImageToBase64 = (imageSrc: typeof Logo) => {
        return new Promise<string>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = reject;
          img.src = imageSrc.src;
        });
      };

      const base64Image = await convertImageToBase64(Logo);
      const pageWidth = doc.internal.pageSize.getWidth();
      const imgWidth = 45;
      const imgHeight = 6;
      const centerX = (pageWidth - imgWidth) / 2;
      doc.addImage(base64Image, 'PNG', centerX, 10, imgWidth, imgHeight);

      const center = pageWidth / 2;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#5B52F9');
      doc.text('REPORT', center, 21, { align: 'center' });

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#627A97');
      doc.text(`Tax saved from ${origin} `, center, 26, { align: 'center' });

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#5B52F9');
      doc.text('REPORT', center, 21, { align: 'center' });
    } catch (error) {
      console.error('Error adding image:', error);
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('black');
    doc.text(
      `${user.firstName == user.lastName ? user.firstName : user.firstName + user.lastName}`,
      15,
      56
    );
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor('gray');
    doc.text(user?.email, 15, 60);

    const determineTableData = (bodyItems: BodyItem[]) => {
      if (bodyItems[0]?.totalItemByCategory !== undefined) {
        return {
          columns: ['Category', 'Total Items', 'Amount'],
          rows: bodyItems.map((item) => [
            item.category || '',
            item.totalItemByCategory?.toString() || '0',
            `NOK ${item.amount?.toFixed(2) || '0.00'}`,
          ]),
        };
      }

      return {
        columns: ['Category', 'Amount'],
        rows: bodyItems.map((item) => [
          item.title || item.category || item.name || '',
          `NOK ${(item.amount || item.total_amount || 0).toFixed(2)}`,
        ]),
      };
    };
    const { columns, rows } = determineTableData(body || []);
    autoTable(doc, {
      startY: 73,
      head: [columns],
      headStyles: {
        fillColor: [217, 217, 217],
        textColor: '#2a363e',
      },
      body: rows,

      styles: {
        cellPadding: 3,
      },
    });

    const currentY = (doc as any).lastAutoTable?.finalY + 5;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginRight = 12;
    const label = 'Deduction Amount in Total:';
    const value = `NOK ${numberFormatter(total)}`;
    const labelWidth = doc.getTextWidth(label);
    const valueWidth = doc.getTextWidth(value);

    const startX = pageWidth - labelWidth - valueWidth - marginRight;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(label, startX, currentY + 20);

    doc.setTextColor('#5B52F9');
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text(value, startX + labelWidth, currentY + 20);

    doc.save('savings_report.pdf');
  };

  return !origin.includes('write off') ? (
    <Badge
      onClick={generatePDFWithImage}
      className="bg-[#F0EFFE] px-1 h-6 hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium"
    >
      <Download size={16} className="mr-2" /> Report
    </Badge>
  ) : (
    <Button
      onClick={generatePDFWithImage}
      className={cn(
        'btn  btn-primary text-white',
        fullWidth && 'w-full',
        !isAuditor && !isGreaterThan1600 && 'text-xs px-3'
      )}
    >
      <Download
        size={!isAuditor && !isGreaterThan1600 ? 14 : 16}
        className="mr-2"
      />{' '}
      Report
    </Button>
  );
}
