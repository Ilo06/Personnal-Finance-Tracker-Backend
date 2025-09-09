import { verifyAccessToken } from '../utils/jwt.js';
import express from "express";
import cookieParser from 'cookie-parser';

const requireAuth = express().use(cookieParser(), (req, res, next) => {
  const auth = cookieParser.signedCookie(req.cookies["access_token"] || '', process.env.COOKIE_SECRET);
  const [scheme, token] = auth.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
});

export default requireAuth;