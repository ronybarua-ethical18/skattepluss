import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import RulesTopSection from './components/rules/RulesTopSection';
import RulesOverviewSection from './components/rules/RulesOverviewSection';

export default function CustomerRules() {
  return (
    <ProtectedLayout>
      <RulesTopSection />
      <RulesOverviewSection />
    </ProtectedLayout>
  );
}
