import { Metadata } from 'next';
import { FavouritesPageView } from '@/components/FavouritesPageView';

export const metadata: Metadata = {
  title: 'My Favourites',
  description: 'Your saved products on ScrollCommerce.',
};

export default function FavouritesPage() {
  return <FavouritesPageView />;
}
