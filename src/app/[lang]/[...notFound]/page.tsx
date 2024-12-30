import React from 'react';
import NotFound from '../not-found';

export default async function Page(props: unknown) {
  if (typeof props === 'object' && props !== null) {
    return <NotFound {...(props as object)} />;
  }
}
