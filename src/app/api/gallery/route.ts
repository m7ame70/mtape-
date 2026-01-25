import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all gallery items
export async function GET() {
    try {
        await dbConnect();
        const gallery = await Gallery.find({}).sort({ createdAt: -1 });
        return NextResponse.json(gallery);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching gallery', error }, { status: 500 });
    }
}

// POST new gallery item
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        if (!body.image) {
            return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
        }

        await dbConnect();
        const newGroup = await Gallery.create(body);

        return NextResponse.json(newGroup, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating gallery item', error }, { status: 500 });
    }
}

// DELETE gallery item
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
        }

        await dbConnect();
        const deletedItem = await Gallery.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting item', error }, { status: 500 });
    }
}
