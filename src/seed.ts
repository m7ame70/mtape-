import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');

    console.log('Connecting to Cloud DB...');
    await mongoose.connect(uri);
    console.log('Connected to DB');

    // Create Admin
    const adminEmail = 'admin@printing.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        admin = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });
        console.log('CREATED Admin: admin@printing.com / admin123');
    } else {
        // Optional: Reset password to ensure it matches
        const hashedPassword = await bcrypt.hash('admin123', 10);
        admin.password = hashedPassword;
        admin.role = 'admin'; // Ensure admin role
        await admin.save();
        console.log('UPDATED Admin: admin@printing.com / admin123');
    }

    // Create Test User
    const testEmail = 'test@example.com';
    let testUser = await User.findOne({ email: testEmail });
    if (!testUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'Test User',
            email: testEmail,
            password: hashedPassword,
            role: 'user',
        });
        console.log('CREATED User: test@example.com / password123');
    } else {
        const hashedPassword = await bcrypt.hash('password123', 10);
        testUser.password = hashedPassword;
        await testUser.save();
        console.log('UPDATED User: test@example.com / password123');
    }

    // Seed Services
    const ServiceSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number },
    }, { timestamps: true });

    const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

    const services = [
        {
            title: "Business Cards",
            description: "High-quality business cards with various finishes like matte, glossy, and soft-touch.",
            image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
            price: 25,
        },
        {
            title: "Flyers & Brochures",
            description: "Eye-catching flyers and brochures to promote your events and products effectively.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
            price: 50,
        },
        {
            title: "Large Format Printing",
            description: "Banners, posters, and signage for maximum visibility.",
            image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&q=80&w=800",
            price: 80,
        },
        {
            title: "Custom Stationary",
            description: "Personalized letterheads, envelopes, and notepads for your brand.",
            image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=800",
            price: 40,
        }
    ];

    for (const s of services) {
        const exists = await Service.findOne({ title: s.title });
        if (!exists) {
            await Service.create(s);
            console.log(`CREATED Service: ${s.title}`);
        } else {
            console.log(` Service exists: ${s.title}`);
        }
    }

    process.exit(0);
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
