// ─── Firebase Auth Middleware ───
// Verifies Firebase ID tokens and attaches user to request

import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import prisma from '../lib/prisma.js';
import { AppError } from './errorHandler.js';

// Initialize Firebase Admin SDK
const firebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (firebaseConfig && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
} else if (!admin.apps.length) {
  // Development fallback — no Firebase configured
  console.warn('⚠️  Firebase not configured — auth middleware will use dev mode');
}

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    email: string;
    name: string;
    gender: string;
    isPregnant: boolean;
  };
}

/**
 * Middleware: Verify Firebase ID token
 * In development without Firebase: accepts any Bearer token and creates a dev user
 */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const token = authHeader.split('Bearer ')[1];

    if (admin.apps.length > 0) {
      // ─── Production: Verify Firebase token ───
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      const user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          name: true,
          gender: true,
        },
      });

      if (!user) {
        throw new AppError('User not found. Please complete registration.', 404);
      }

      req.user = {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name || 'User',
        gender: (user.gender as string) || 'Other',
        isPregnant: false,
      };
    } else {
      // ─── Development mode: Accept dev tokens ───
      const userId = token.startsWith('dev_') ? token.replace('dev_', '') : token;

      let user = await prisma.user.findFirst({
        where: { 
          OR: [
            { id: userId },
            { firebaseUid: userId },
            { email: `${userId}@dev.aether` }
          ]
        },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          name: true,
          gender: true,
        },
      });

      if (!user) {
        // Auto-create dev user
        user = await prisma.user.create({
          data: {
            firebaseUid: `dev_${userId}`,
            email: `${userId}@dev.aether`,
            name: 'Dev User',
            gender: 'Male',
            age: 28,
          },
          select: {
            id: true,
            firebaseUid: true,
            email: true,
            name: true,
            gender: true,
          },
        });
      }

      req.user = {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name || 'Dev User',
        gender: (user.gender as string) || 'Male',
        isPregnant: false,
      };
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired authentication token', 401));
    }
  }
}

/**
 * Optional auth — attaches user if token present, but doesn't block
 */
export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      await requireAuth(req, _res, () => {});
    }
  } catch {
    // Silently continue without auth
  }
  next();
}
