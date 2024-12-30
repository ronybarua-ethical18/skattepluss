import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import CategoryTable from './components/categories/CategoryTable';
import CategoryCard from './components/categories/CategoryCard';

export default function CustomerCategories() {
  return (
    <ProtectedLayout>
      <CategoryCard />
      <CategoryTable />
    </ProtectedLayout>
  );
}
