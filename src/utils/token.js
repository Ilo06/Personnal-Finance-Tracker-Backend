import { signAccessToken, signRefreshToken } from './jwt.js';

export const issueTokens = async (user, rememberMe) => {
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, rememberMe }, { expiresIn: rememberMe ? '30d' : process.env.JWT_REFRESH_EXPIRES || '7d' });

    return { accessToken, refreshToken };
};