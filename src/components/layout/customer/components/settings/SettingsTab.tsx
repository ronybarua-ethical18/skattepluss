'use client';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import AuditorsTable from './AuditorsTable';
import ProfileTabContent from './ProfileTabContent';
import { usePathname } from 'next/navigation';
import CustomersTable from './CustomersTable';
import AddAuditorModal from './AddAuditorModal';

export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'auditors' | 'customers'
  >('profile');
  const pathname = usePathname();

  return (
    <div className="rounded-2xl p-6 bg-white h-full">
      <h2 className="text-xl font-bold text-[#101010]">Settings</h2>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as 'profile' | 'auditors' | 'customers')
        }
        className="mt-4"
      >
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto space-x-6">
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value="profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value={pathname?.includes('auditor') ? 'customers' : 'auditors'}
            >
              {pathname?.includes('auditor') ? 'Customers' : 'Auditors'}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <ProfileTabContent />
        </TabsContent>

        <TabsContent
          value={pathname?.includes('auditor') ? 'customers' : 'auditors'}
        >
          <div className="mt-6 z-50">
            <div className="flex  justify-end items-center mb-4">
              {pathname?.includes('customer') && (
                <div className="z-50">
                  <AddAuditorModal />
                </div>
              )}
            </div>
            {pathname?.includes('customer') ? (
              <AuditorsTable />
            ) : (
              <CustomersTable />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
