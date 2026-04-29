import { Metadata } from 'next';
import { NewArrivalsPageView } from '@/components/NewArrivalsPageView';
import { getProducts } from '@/app/actions';

export const metadata: Metadata = {
  title: 'New Drops | KinCloth',
  description: 'The latest streetwear drops and limited edition collections from KinCloth. No restocks.',
};

export default async function NewArrivalsPage() {
  const initialProducts = await getProducts(1, 4);

  return <NewArrivalsPageView initialProducts={initialProducts} />;
}
