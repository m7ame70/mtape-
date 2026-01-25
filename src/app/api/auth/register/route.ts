import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 500 });
    }
}
