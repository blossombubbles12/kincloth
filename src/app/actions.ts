'use server'

import { Product } from '@/lib/types'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000'

export async function getProducts(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit
    const url = new URL(`${MEDUSA_URL}/store/products`)
    url.searchParams.append('limit', String(limit))
    url.searchParams.append('offset', String(offset))
    url.searchParams.append('fields', 'id,title,thumbnail,description,metadata,created_at,*variants,*variants.prices')

    const response = await fetch(url.toString(), {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
      },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000) // Timeout after 5s to prevent hanging
    })

    if (!response.ok) throw new Error(`Medusa API error: ${response.statusText}`)

    const { products } = await response.json()

    return products.map((p: any) => {
      const variant = p.variants?.[0];
      return {
        id: p.id,
        variant_id: variant?.id || p.id, // Ensure we always have an ID for cart actions
        name: p.title,
        price: (variant?.prices?.[0]?.amount || 0) / 100,
        video_url: p.metadata?.video_url || '',
        thumbnail_url: p.thumbnail,
        description: p.description,
        brand: p.metadata?.brand || 'Brand',
        category: p.metadata?.category || p.categories?.[0]?.name || 'Fashion',
        created_at: p.created_at,
        variants: p.variants || []
      }
    }) as Product[]
  } catch (error) {
    console.warn('[getProducts] Connection failed, using mock data:', error)
    return [
      {
        id: 'prod_1',
        variant_id: 'var_1',
        name: 'Premium Leather Bag',
        price: 129.99,
        video_url: 'https://v.ftcdn.net/06/17/57/41/700_F_617574167_H7PjC4p6pPz9FhW3ZzE4p7y6o9iX2W2U_ST.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800',
        description: 'Handcrafted premium leather bag for the modern professional.',
        brand: 'Luxe',
        category: 'Bags',
        created_at: new Date().toISOString()
      },
      {
        id: 'prod_2',
        variant_id: 'var_2',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 299.00,
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
        description: 'Experience pure sound with our latest noise-cancelling technology.',
        brand: 'AudioPro',
        category: 'Tech',
        created_at: new Date().toISOString()
      }
    ] as Product[]
  }
}

export async function getProductById(id: string) {
  try {
    const url = new URL(`${MEDUSA_URL}/store/products/${id}`)
    url.searchParams.append('fields', 'id,title,thumbnail,description,metadata,created_at,*variants,*variants.prices')

    const response = await fetch(url.toString(), {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
      },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) return null

    const { product: p } = await response.json()
    return {
      id: p.id,
      variant_id: p.variants?.[0]?.id || p.id || '',
      name: p.title,
      price: (p.variants?.[0]?.prices?.[0]?.amount || 0) / 100,
      video_url: p.metadata?.video_url || '',
      thumbnail_url: p.thumbnail,
      description: p.description,
      brand: p.metadata?.brand || 'Brand',
      category: p.metadata?.category || p.categories?.[0]?.name || 'Fashion',
      created_at: p.created_at,
      images: p.images?.map((img: any) => img.url) || [],
      variants: p.variants || [],
    } as Product & { images: string[]; variants: any[] }
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
}
export async function getCategories() {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/product-categories`, {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
      },
      next: { revalidate: 3600 }
    })
    if (!response.ok) return []
    const { product_categories } = await response.json()
    return product_categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
