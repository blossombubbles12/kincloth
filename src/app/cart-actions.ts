'use server'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000'
const TIMEOUT_MS = 3000

function timeout() {
  return AbortSignal.timeout(TIMEOUT_MS)
}

export async function createCart() {
  try {
    // 1. Get available regions first
    const regionsRes = await fetch(`${MEDUSA_URL}/store/regions`, {
      headers: { 'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '' },
      signal: timeout(),
    })
    if (!regionsRes.ok) return null
    const { regions } = await regionsRes.json()
    const regionId = regions?.[0]?.id

    // 2. Create cart with region
    const response = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({ region_id: regionId }),
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function getCart(cartId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function addToCartMedusa(cartId: string, variantId: string, quantity: number = 1) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({ variant_id: variantId, quantity }),
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function updateLineItemMedusa(cartId: string, lineItemId: string, quantity: number) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({ quantity }),
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function deleteLineItemMedusa(cartId: string, lineItemId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
      headers: { 'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '' },
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function updateCartMedusa(cartId: string, data: any) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify(data),
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function getShippingOptions(cartId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/shipping-options`, {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      signal: timeout(),
    })
    if (!response.ok) return []
    const { shipping_options } = await response.json()
    return shipping_options
  } catch {
    return []
  }
}

export async function addShippingMethod(cartId: string, optionId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/shipping-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({ option_id: optionId }),
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function createPaymentSessions(cartId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/payment-sessions`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      signal: timeout(),
    })
    if (!response.ok) return null
    const { cart } = await response.json()
    return cart
  } catch {
    return null
  }
}

export async function completeCart(cartId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      signal: timeout(),
    })
    if (!response.ok) return { type: null, data: null }
    const { type, data } = await response.json()
    return { type, data }
  } catch {
    return { type: null, data: null }
  }
}
