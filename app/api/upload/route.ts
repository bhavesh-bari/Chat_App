import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
export const dynamic = 'force-dynamic';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    }).end(buffer)
  })

  return NextResponse.json({ url: (uploadResult as any).secure_url })
}
