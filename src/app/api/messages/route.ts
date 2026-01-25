import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();
        const message = await Message.create(body);
        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error sending message', error }, { status: 500 });
    }
}

export async function GET() {
    // Protect this route later or in middleware
    try {
        await dbConnect();
        const messages = await Message.find({}).sort({ createdAt: -1 });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching messages', error }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();
        await dbConnect();
        const message = await Message.findByIdAndUpdate(
            id,
            { viewed: true },
            { new: true }
        );
        if (!message) {
            return NextResponse.json({ message: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating message', error }, { status: 500 });
    }
}
