import { NextResponse } from "next/server";
import mongoose from "mongoose";
import HeroSlide from "@/models/HeroSlide";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    await mongoose.connect(MONGODB_URI as string);
}

export async function GET() {
    try {
        await connectDB();
        const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json(slides);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { title, subtitle, image } = body;

        if (!title || !image) {
            return NextResponse.json({ error: "Title and Image are required" }, { status: 400 });
        }

        const newSlide = await HeroSlide.create({ title, subtitle, image });
        return NextResponse.json(newSlide, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, title, subtitle, image } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updatedSlide = await HeroSlide.findByIdAndUpdate(
            id,
            { title, subtitle, image },
            { new: true }
        );

        if (!updatedSlide) {
            return NextResponse.json({ error: "Slide not found" }, { status: 404 });
        }

        return NextResponse.json(updatedSlide);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await HeroSlide.findByIdAndDelete(id);
        return NextResponse.json({ message: "Slide deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
    }
}
