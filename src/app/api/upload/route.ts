import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary is configured
const isCloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

// Configure Cloudinary if environment variables are present
if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ message: 'Invalid file type. Only images allowed.' }, { status: 400 });
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ message: 'File too large. Max 5MB.' }, { status: 400 });
        }

        // Create unique filename and buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${originalName}`;

        // If Cloudinary is configured, upload to Cloudinary
        if (isCloudinaryConfigured) {
            try {
                // Convert to data URI for upload
                const base64 = buffer.toString('base64');
                const dataUri = `data:${file.type};base64,${base64}`;

                const result = await cloudinary.uploader.upload(dataUri, {
                    folder: 'printing-house',
                    public_id: filename.replace(/\.[^.]+$/, ''),
                    resource_type: 'image',
                    use_filename: false,
                    unique_filename: false,
                });

                // Return Cloudinary secure URL and public id
                return NextResponse.json(
                    { url: result.secure_url, public_id: result.public_id },
                    { status: 200 }
                );
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('Cloudinary upload error:', errorMessage);

                // On production (Vercel), return error - no local fallback
                if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
                    return NextResponse.json(
                        { message: `Cloudinary upload failed: ${errorMessage}` },
                        { status: 500 }
                    );
                }
                // In development, fall through to local save
            }
        } else {
            // Cloudinary not configured
            if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { message: 'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' },
                    { status: 500 }
                );
            }
        }

        // Fallback for development: Ensure uploads directory exists and save file locally
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch {
            // Directory might already exist
        }

        // Save file locally
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        // Return public URL for local file
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: publicUrl }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Upload error:', errorMessage);
        return NextResponse.json({ message: `Error uploading file: ${errorMessage}` }, { status: 500 });
    }
}

