'use server'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000'

export async function ensureDefaultRegion() {
  try {
    // 1. Check if regions exist
    const regionsRes = await fetch(`${MEDUSA_URL}/store/regions`)
    const { regions } = await regionsRes.json()

    if (regions && regions.length > 0) {
      return regions[0].id
    }

    // 2. No region found, we need to create one via the Admin API
    // Note: This normally requires an API token, but for local dev we can try 
    // to use the store API if it's open or tell the user to create it.
    // In Medusa 2.0, we really should have a region.
    
    return null
  } catch (error) {
    console.error('Error ensuring default region:', error)
    return null
  }
}
