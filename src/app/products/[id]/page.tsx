import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/app/actions';
import { ProductDetailsView } from '@/components/ProductDetailsView';
import { ProductJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scrollcommerce.store';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const productUrl = `${SITE_URL}/products/${id}`;
  const discountedPrice = (product.price * 1.4).toFixed(2);

  return {
    title: product.name,
    description: product.description ||
      `Shop ${product.name} at ScrollCommerce. Premium quality, free shipping, 30-day returns.`,
    keywords: [product.name, product.brand || '', 'buy online', 'free shipping', 'ScrollCommerce'],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website',
      url: productUrl,
      title: `${product.name} — $${product.price.toFixed(2)} | ScrollCommerce`,
      description: product.description ||
        `Shop ${product.name} at ScrollCommerce. Free shipping on orders over $50.`,
      images: product.thumbnail_url
        ? [{ url: product.thumbnail_url, width: 800, height: 800, alt: product.name }]
        : [],
      siteName: 'ScrollCommerce',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — $${product.price.toFixed(2)}`,
      description: `Shop ${product.name} at ScrollCommerce. Was $${discountedPrice} — Now $${product.price.toFixed(2)}!`,
      images: product.thumbnail_url ? [product.thumbnail_url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([
    getProductById(id),
    getProducts(1, 12),
  ]);

  if (!product) notFound();

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
      <ProductJsonLd product={product} />
      <ProductDetailsView product={product} allProducts={allProducts} />
    </main>
  );
}
