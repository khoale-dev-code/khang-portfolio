import { NextResponse } from 'next/server'
import { localMediaAssets } from '../../../data/local-media-assets'
import { requireAdmin } from '../../../lib/auth'

export async function GET() {
  try {
    const { supabase } = await requireAdmin()

    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const cloudAssets = (data || []).map((asset) => ({
      ...asset,
      source: 'cloudinary',
      read_only: false,
    }))

    return NextResponse.json({
      assets: [...localMediaAssets, ...cloudAssets],
    })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Unable to load media.' },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  const { supabase, userId } = await requireAdmin()
  const payload = await request.json()

  if (!payload?.publicId || !payload?.secureUrl) {
    return NextResponse.json(
      { error: 'Invalid media payload.' },
      { status: 400 },
    )
  }

  const { data, error } = await supabase
    .from('media_assets')
    .upsert(
      {
        public_id: payload.publicId,
        secure_url: payload.secureUrl,
        resource_type: payload.resourceType || 'image',
        width: payload.width,
        height: payload.height,
        bytes: payload.bytes,
        original_filename: payload.originalFilename,
        created_by: userId,
      },
      { onConflict: 'public_id' },
    )
    .select('*')
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    )
  }

  return NextResponse.json({
    asset: {
      ...data,
      source: 'cloudinary',
      read_only: false,
    },
  })
}
