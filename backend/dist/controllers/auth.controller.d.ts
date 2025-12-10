import { Request, Response } from 'express';
declare class AuthController {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * Login user
     * POST /api/auth/login
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * Get current user
     * GET /api/auth/me
     */
    getMe(req: any, res: Response): Promise<void>;
}
export declare const registerValidation: import("express-validator").ValidationChain[];
export declare const loginValidation: import("express-validator").ValidationChain[];
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map