"use strict";
/**
 * Shared Database Connection
 *
 * Core database connection for all modules to use.
 * Modules should NOT create their own connections.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.pool = database_1.default;
exports.default = database_1.default;
//# sourceMappingURL=database.js.map