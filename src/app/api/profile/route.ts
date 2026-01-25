import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET current user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PUT update user profile
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { name, image } = body;

        console.log('Updating profile for:', session.user.email);
        console.log('New data:', { name, imageLength: image?.length, imagePreview: image?.substring(0, 50) });

        const updateData: any = {};
        if (name) updateData.name = name;
        if (image !== undefined) updateData.image = image;

        console.log('Update data keys:', Object.keys(updateData));

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            updateData,
            { new: true, runValidators: false }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('User updated successfully:', {
            name: user.name,
            hasImage: !!user.image,
            imageLength: user.image?.length
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
