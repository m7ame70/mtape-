import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export async function GET() {
    try {
        await dbConnect();
        const services = await Service.find({}).sort({ createdAt: -1 });
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching services', error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();
        const service = await Service.create(body);
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating service', error }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ message: 'Service ID required' }, { status: 400 });
        }

        await dbConnect();
        const service = await Service.findByIdAndUpdate(_id, updateData, { new: true });

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating service', error }, { status: 500 });
    }
}

