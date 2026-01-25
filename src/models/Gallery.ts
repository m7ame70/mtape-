import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    category: {
        type: String,
        default: 'General',
    },
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
