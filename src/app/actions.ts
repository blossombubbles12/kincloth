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
        name: 'Heavyweight Signature Hoodie',
        price: 129.99,
        video_url: 'https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778146097/kincloth1_oajsov.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
        description: 'Unapologetic. Unfiltered. Unyielding.',
        brand: 'KINCLOTH',
        category: 'Hoodies',
        created_at: new Date().toISOString()
      },
      {
        id: 'prod_2',
        variant_id: 'var_2',
        name: 'Tactical Cargo Pants',
        price: 149.00,
        video_url: 'https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778153126/kincloth6_lzl4i6.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1628751508670-659779d77fbc?q=80&w=800',
        description: 'Deep blacks. Hard edges. Zero compromise.',
        brand: 'KINCLOTH',
        category: 'Bottoms',
        created_at: new Date().toISOString()
      },
      {
        id: 'prod_3',
        variant_id: 'var_3',
        name: 'Performance Compression Tee',
        price: 59.99,
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800',
        description: 'Built for those who lead, never follow.',
        brand: 'KINCLOTH',
        category: 'Activewear',
        created_at: new Date().toISOString()
      },
      {
        id: 'prod_4',
        variant_id: 'var_4',
        name: 'Essential Plain Tee',
        price: 39.99,
        video_url: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
        description: 'The culture has no rules. Neither do we.',
        brand: 'KINCLOTH',
        category: 'Plain Tees',
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
