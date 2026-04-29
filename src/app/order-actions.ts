'use server'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

export async function getOrderAction(orderId: string, email: string) {
  try {
    // Note: In Medusa 2.0, retrieving an order by ID via store API 
    // might require the order to belong to the current customer session.
    // For guest tracking, we often use the order ID (id or display_id).
    
    // We try to fetch the order by ID
    const response = await fetch(`${MEDUSA_URL}/store/orders/${orderId}?fields=*items,*shipping_address,*fulfillment_status,*payment_status,*summary`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      next: { revalidate: 0 } // Don't cache order lookups
    })

    if (!response.ok) {
      // If not found by ID, maybe it's a display_id? 
      // Some Medusa setups allow searching by display_id
      const searchRes = await fetch(`${MEDUSA_URL}/store/orders?display_id=${orderId}&email=${email}&fields=*items,*shipping_address`, {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_KEY,
        },
      })
      
      if (searchRes.ok) {
        const { orders } = await searchRes.json()
        if (orders && orders.length > 0) {
          const order = orders[0]
          if (order.email.toLowerCase() === email.toLowerCase()) {
            return { success: true, order }
          }
        }
      }
      
      return { success: false, error: 'Order not found' }
    }

    const { order } = await response.json()

    // Verify email matches
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: 'Order not found or email mismatch' }
    }

    return { success: true, order }
  } catch (error) {
    console.error('Track Order Error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
