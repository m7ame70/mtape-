import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        await Service.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Service deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting service', error }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        await dbConnect();
        const updatedService = await Service.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedService);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating service', error }, { status: 500 });
    }
}
