import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from '../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  await requireAdmin()

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const folder = process.env.CLOUDINARY_FOLDER || 'KHANG'

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary server credentials are missing in .env.local.' }, { status: 500 })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret)

  return NextResponse.json({ cloudName, apiKey, folder, timestamp, signature })
}
