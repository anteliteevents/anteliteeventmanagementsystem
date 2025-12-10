"use strict";
/**
 * Users Routes
 * API routes for user management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and admin role
router.use(auth_middleware_1.authenticate);
router.use(auth_middleware_1.requireAdmin);
// Get all users
router.get('/', users_controller_1.default.getAllUsers);
// Get user by ID
router.get('/:id', users_controller_1.default.getUserById);
// Toggle user active status
router.put('/:id/toggle-active', users_controller_1.default.toggleActive);
// Update user role
router.put('/:id/role', users_controller_1.default.updateRole);
exports.default = router;
//# sourceMappingURL=users.routes.js.map