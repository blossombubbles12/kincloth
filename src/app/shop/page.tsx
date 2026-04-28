import { ShopPageView } from '@/components/ShopPageView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full collection of premium products on ScrollCommerce.',
};

export default function ShopPage() {
  return <ShopPageView initialProducts={[]} />;
}
