import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
    },
    service: {
        type: String,
        required: false,
    },
    viewed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Delete the model if it exists to force reload
if (mongoose.models.Message) {
    delete mongoose.models.Message;
}

export default mongoose.model('Message', MessageSchema);
