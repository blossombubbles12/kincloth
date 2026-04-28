import { Metadata } from 'next';
import { FavouritesPageView } from '@/components/FavouritesPageView';

export const metadata: Metadata = {
  title: 'My Favourites',
  description: 'Your saved products on ScrollCommerce.',
};

export default function FavouritesPage() {
  return (
    <main
      style={{
        height: '100svh',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'var(--background)',
        color: 'var(--foreground)',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <FavouritesPageView />
    </main>
  );
}
