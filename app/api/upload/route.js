import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

// R2 is S3-compatible: point the S3 client at your account's R2 endpoint.
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  // Folder comes from the client, so restrict it to safe characters.
  const rawFolder = formData.get('folder') || 'uploads';
  const folder = String(rawFolder).replace(/[^a-zA-Z0-9_\-\/]/g, '').replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/') || 'uploads';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  // R2 keys are literal, so keep the extension on every file.
  const rawExt = file.name?.includes('.') ? file.name.split('.').pop() : '';
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const key = `${folder}/${randomUUID()}${ext ? `.${ext}` : ''}`;

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      })
    );

    return NextResponse.json({
      url: `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`,
      publicId: key,
    });
  } catch (err) {
    console.error('R2 upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}