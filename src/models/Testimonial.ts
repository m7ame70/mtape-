import mongoose from 'mongoose';

// Delete the model if it already exists to ensure we get the latest schema
if (mongoose.models.Testimonial) {
    delete mongoose.models.Testimonial;
}

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5,
    },
    image: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
