import { verifyOTP } from '../services/otpService.js';

export default function createOtpMiddleware(purpose) {
    return async function (req, res, next) {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({ error: 'Email and code required' });
            }

            const verification = await verifyOTP(email, code, purpose);

            if (!verification.valid) {
                return res.status(401).json({ error: verification.error });
            }

            req.verifiedEmail = email;
            next();
        } catch (error) {
            // console.error(error);
            res.status(500).json({ error: 'Verification failed' });
        }
    };
}
