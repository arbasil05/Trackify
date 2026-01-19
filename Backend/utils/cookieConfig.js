// Cookie configuration for JWT tokens
// Centralizes cookie settings to avoid duplication

const isProduction = process.env.NODE_ENV === 'production';

export const JWT_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const clearCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
};
