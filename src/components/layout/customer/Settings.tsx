'use client';

import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import SettingsTab from './components/settings/SettingsTab';

export default function UserSettings() {
  return (
    <ProtectedLayout>
      <SettingsTab />
    </ProtectedLayout>
  );
}
