'use client';
import { Card } from '@/components/ui/card';
import React from 'react';
import { useTranslation } from '@/lib/TranslationProvider';

export default function RulesTopSection() {
  const { translate } = useTranslation();

  return (
    <Card className="rounded-2xl space-y-2 shadow-none border border-[#EEF0F4] p-6">
      <h3 className="text-xl text-[#101010] font-semibold">
        {translate('page.rulesTopSection.title')}
      </h3>
      <p className="text-xs text-[#71717A] font-bold">
        {translate('page.rulesTopSection.subtitle')}
      </p>
    </Card>
  );
}
