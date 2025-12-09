import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * Verify JWT token and attach user to request
 */
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Require admin role
 */
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * Require exhibitor role
 */
export declare const requireExhibitor: (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * Generate JWT token
 */
export declare const generateToken: (user: {
    id: string;
    email: string;
    role: string;
}) => string;
//# sourceMappingURL=auth.middleware.d.ts.map