import { ShopPageView } from '@/components/ShopPageView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full collection of premium products on ScrollCommerce.',
};

import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black uppercase tracking-widest text-xs">Loading Collection...</div>}>
      <ShopPageView initialProducts={[]} />
    </Suspense>
  );
}
