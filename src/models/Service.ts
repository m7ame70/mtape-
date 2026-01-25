import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    price: {
        type: Number,
    },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
