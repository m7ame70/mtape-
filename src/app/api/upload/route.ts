import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
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

        // Create unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${originalName}`;

        // Ensure uploads directory exists
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }

        // Save file
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        // Return public URL
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: publicUrl }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Error uploading file', error }, { status: 500 });
    }
}
