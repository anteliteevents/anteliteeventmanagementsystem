"use strict";
/**
 * Logger Configuration
 *
 * Centralized logging system using Winston.
 * Replaces console.log/error with structured logging.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const logger = winston_1.default.createLogger({
    level: logLevel,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: 'antelite-events-backend' },
    transports: [
        // Write all logs to console
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })),
        }),
    ],
});
// In production, also log to file
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }));
    logger.add(new winston_1.default.transports.File({
        filename: 'logs/combined.log',
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map