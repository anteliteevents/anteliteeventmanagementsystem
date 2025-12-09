"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireExhibitor = exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'No token provided',
                },
            });
            return;
        }
        const token = authHeader.substring(7);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // Verify user still exists and is active
            const user = await user_model_1.default.findByIdSafe(decoded.id);
            if (!user || !user.isActive) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User not found or inactive',
                    },
                });
                return;
            }
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid or expired token',
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            error: {
                code: 'FORBIDDEN',
                message: 'Admin access required',
            },
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
/**
 * Require exhibitor role
 */
const requireExhibitor = (req, res, next) => {
    if (!req.user || req.user.role !== 'exhibitor') {
        res.status(403).json({
            success: false,
            error: {
                code: 'FORBIDDEN',
                message: 'Exhibitor access required',
            },
        });
        return;
    }
    next();
};
exports.requireExhibitor = requireExhibitor;
/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, JWT_SECRET, {
        expiresIn: '7d',
    });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.middleware.js.map