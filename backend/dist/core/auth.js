"use strict";
/**
 * Shared Authentication Utilities
 *
 * Core authentication functions for modules to use.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireExhibitor = exports.requireAdmin = exports.authenticate = void 0;
var auth_middleware_1 = require("../middleware/auth.middleware");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_middleware_1.authenticate; } });
Object.defineProperty(exports, "requireAdmin", { enumerable: true, get: function () { return auth_middleware_1.requireAdmin; } });
Object.defineProperty(exports, "requireExhibitor", { enumerable: true, get: function () { return auth_middleware_1.requireExhibitor; } });
Object.defineProperty(exports, "generateToken", { enumerable: true, get: function () { return auth_middleware_1.generateToken; } });
//# sourceMappingURL=auth.js.map