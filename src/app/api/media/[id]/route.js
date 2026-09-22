import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/auth'

function configureCloudinary() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary server credentials are not configured.')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export async function PATCH(request, context) {
  try {
    const { id } = await context.params
    const { supabase } = await requireAdmin()
    const payload = await request.json()
    const name = String(payload?.originalFilename || '').trim()

    if (!name) {
      return NextResponse.json(
        { error: 'Tên ảnh không được để trống.' },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('media_assets')
      .update({
        original_filename: name,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({
      asset: {
        ...data,
        source: 'cloudinary',
        read_only: false,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Không thể cập nhật ảnh.' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request, context) {
  try {
    const { id } = await context.params
    const { supabase } = await requireAdmin()

    const { data: asset, error: loadError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .single()

    if (loadError) throw loadError

    configureCloudinary()

    const resourceType =
      asset.resource_type && asset.resource_type !== 'image'
        ? asset.resource_type
        : 'image'

    const result = await cloudinary.uploader.destroy(asset.public_id, {
      resource_type: resourceType,
      invalidate: true,
    })

    if (!['ok', 'not found'].includes(result?.result)) {
      throw new Error(
        `Cloudinary delete failed: ${result?.result || 'unknown result'}`,
      )
    }

    const { error: deleteError } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Không thể xóa ảnh.' },
      { status: 500 },
    )
  }
}
