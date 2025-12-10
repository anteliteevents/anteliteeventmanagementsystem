"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = __importStar(require("../controllers/event.controller"));
const router = (0, express_1.Router)();
// Public routes
router.get('/active', event_controller_1.default.getActiveEvents.bind(event_controller_1.default));
router.get('/:id', event_controller_1.default.getEventById.bind(event_controller_1.default));
router.get('/:id/statistics', event_controller_1.default.getEventStatistics.bind(event_controller_1.default));
// Protected routes (require authentication)
// For now, we'll make all routes accessible, but you can add authentication later
router.get('/', event_controller_1.default.getAllEvents.bind(event_controller_1.default));
router.post('/', event_controller_1.createEventValidation, event_controller_1.default.createEvent.bind(event_controller_1.default));
router.put('/:id', event_controller_1.updateEventValidation, event_controller_1.default.updateEvent.bind(event_controller_1.default));
router.delete('/:id', event_controller_1.default.deleteEvent.bind(event_controller_1.default));
router.post('/:id/duplicate', event_controller_1.default.duplicateEvent.bind(event_controller_1.default));
// TODO: Uncomment when authentication is ready
// router.get('/', authenticate, EventController.getAllEvents.bind(EventController));
// router.post('/', authenticate, createEventValidation, EventController.createEvent.bind(EventController));
// router.put('/:id', authenticate, updateEventValidation, EventController.updateEvent.bind(EventController));
// router.delete('/:id', authenticate, EventController.deleteEvent.bind(EventController));
exports.default = router;
//# sourceMappingURL=event.routes.js.map