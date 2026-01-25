import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all users
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        // Exclude password field
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
    }
}

// PUT update user role
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, role } = await req.json();

        if (!id || !role) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
    }
}

// DELETE user
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
        }

        await dbConnect();

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
    }
}
