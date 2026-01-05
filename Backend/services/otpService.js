import bcrypt from 'bcrypt';
import OTP from '../models/Otp.js';
import User from '../models/User.js';
import transporter from "../config/nodemailer.js";

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function storeOTP(email, code, purpose) {

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const hashedCode = await bcrypt.hash(code, 10);

    await OTP.deleteMany({ email, purpose });

    await OTP.create({
        email,
        code: hashedCode,
        purpose,
        expiresAt
    });
};

export async function verifyOTP(email, code, purpose) {
    const otp = await OTP.findOne({ email, purpose });

    if (!otp) {
        return { valid: false, error: 'OTP not found' };
    }

    if (new Date() > otp.expiresAt) {
        await OTP.findByIdAndDelete(otp._id);
        return { valid: false, error: 'OTP expired' };
    }

    const isValid = await bcrypt.compare(code, otp.code);

    if (!isValid) {
        return { valid: false, error: 'OTP invalid' };
    }

    await OTP.findByIdAndDelete(otp._id);

    return { valid: true };
};


export async function sendOTP(email, code, purpose) {

    let subject, text;
    if (purpose === 'registration') {
        subject = 'Verify Email';
        text = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`;
    }
    else {
        subject = 'Password Reset Code';
        text = `Your password reset code is: ${code}\n\nThis code will expire in 10 minutes.`;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        text: text
    });
};
