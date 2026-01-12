import bcrypt from 'bcrypt';
import OTP from '../models/Otp.js';
import transporter from "../config/nodemailer.js";

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

function htmlTemplate(otp, purpose) {
    return `<body style="font-family:system-ui;background:#f5f5f5;margin:0;padding:10px"><div style="max-width:400px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden"><div style="background:#4880FF;padding:15px 20px;text-align:center;color:#fff"><h1 style="font-size:24px;font-weight:700;margin:0">Trackify</h1></div><div style="padding:10px 20px;text-align:center"><p style="margin:10px 0;font-size:18px;color:#555"> ${purpose === "registration" ? "So… someone’s trying to sign up. Prove it’s you." : "You forgot your password again, didn’t you."} </p><div style="background:#f0f3f7;border:2px solid #4880FF;border-radius:6px;padding:10px;margin:15px 0"><div style="font-size:40px;font-weight:700;letter-spacing:6px;color:#4880FF;font-family:monospace"> ${otp} </div><div style="font-size:12px;color:#777;margin-top:8px"> Expires in 10 minutes </div></div><p style="font-size:12px;color:#777"> If you didn't request this, ignore this email. </p></div><div style="padding:10px 20px;text-align:center;border-top:1px solid #e0e0e0;font-size:11px;color:#777"> © 2026 Trackify </div></div></body>`
}

function textTemplate(otp, purpose) {
    return ` ${purpose === "registration" ? "So… someone's trying to sign up. Prove it's you." : "You forgot your password again, didn't you."} \n \n ${otp} \n \n Expires in 10 minutes \n \n If you didn't request this, ignore this email.`
}

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

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: purpose === "registration" ? "Verify Email" : "Password Reset Code",
        text: textTemplate(code, purpose),
        html: htmlTemplate(code, purpose)
    });
};
