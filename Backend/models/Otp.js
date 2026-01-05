import { Schema, model } from 'mongoose';

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['registration', 'password_reset'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

otpSchema.index({ email: 1, purpose: 1 });

export default model('OTP', otpSchema);
