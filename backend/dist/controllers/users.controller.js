"use strict";
/**
 * Users Controller
 * Handles user management operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
class UsersController {
    /**
     * Get all users (admin only)
     */
    async getAllUsers(req, res) {
        try {
            const users = await user_model_1.default.findAll();
            res.json({
                success: true,
                data: users,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    }
    /**
     * Get user by ID
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await user_model_1.default.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    },
                });
                return;
            }
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    }
    /**
     * Toggle user active status
     */
    async toggleActive(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            const user = await user_model_1.default.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    },
                });
                return;
            }
            await user_model_1.default.updateActiveStatus(id, isActive);
            res.json({
                success: true,
                data: {
                    id,
                    isActive,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    }
    /**
     * Update user role
     */
    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!['admin', 'exhibitor'].includes(role)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Role must be either "admin" or "exhibitor"',
                    },
                });
                return;
            }
            const user = await user_model_1.default.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    },
                });
                return;
            }
            await user_model_1.default.updateRole(id, role);
            res.json({
                success: true,
                data: {
                    id,
                    role,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    }
}
exports.default = new UsersController();
//# sourceMappingURL=users.controller.js.map