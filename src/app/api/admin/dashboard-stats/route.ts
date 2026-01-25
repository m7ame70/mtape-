import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Get counts
        const serviceCount = await Service.countDocuments();
        const messageCount = await Message.countDocuments();
        const userCount = await User.countDocuments();

        // Get recent messages (last 3)
        const recentMessages = await Message.find({})
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        // Get recent users (last 5)
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password')
            .lean();

        return NextResponse.json({
            serviceCount,
            messageCount,
            userCount,
            recentMessages: JSON.parse(JSON.stringify(recentMessages)),
            recentUsers: JSON.parse(JSON.stringify(recentUsers)),
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
