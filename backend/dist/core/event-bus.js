"use strict";
/**
 * Event Bus System
 *
 * Central event bus for module-to-module communication.
 * Modules MUST communicate only via events - no direct calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = void 0;
const events_1 = require("events");
class EventBus extends events_1.EventEmitter {
    constructor() {
        super();
        this.eventHistory = new Map();
        this.maxHistorySize = 100;
        this.setMaxListeners(100); // Allow many listeners
    }
    /**
     * Emit an event (sync, matches EventEmitter signature)
     */
    emit(event, payload = {}) {
        const enrichedPayload = {
            ...payload,
            timestamp: new Date(),
            module: payload.module || 'unknown'
        };
        // Store in history
        this.addToHistory(event, enrichedPayload);
        // Emit synchronously (EventEmitter default)
        return super.emit(event, enrichedPayload);
    }
    /**
     * Emit event and wait for all listeners to complete
     */
    async emitAsync(event, payload = {}) {
        const enrichedPayload = {
            ...payload,
            timestamp: new Date(),
            module: payload.module || 'unknown'
        };
        this.addToHistory(event, enrichedPayload);
        const listeners = this.listeners(event);
        const promises = listeners.map(listener => {
            try {
                const result = listener(enrichedPayload);
                return result instanceof Promise ? result : Promise.resolve();
            }
            catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
                return Promise.resolve();
            }
        });
        await Promise.all(promises);
    }
    /**
     * Subscribe to an event
     */
    on(event, listener) {
        return super.on(event, listener);
    }
    /**
     * Subscribe to an event once
     */
    once(event, listener) {
        return super.once(event, listener);
    }
    /**
     * Unsubscribe from an event
     */
    off(event, listener) {
        return super.off(event, listener);
    }
    /**
     * Get event history
     */
    getHistory(event) {
        if (event) {
            return this.eventHistory.get(event) || [];
        }
        const allEvents = [];
        this.eventHistory.forEach((events) => {
            allEvents.push(...events);
        });
        return allEvents.sort((a, b) => {
            const aTime = a.timestamp?.getTime() || 0;
            const bTime = b.timestamp?.getTime() || 0;
            return bTime - aTime;
        });
    }
    /**
     * Clear event history
     */
    clearHistory(event) {
        if (event) {
            this.eventHistory.delete(event);
        }
        else {
            this.eventHistory.clear();
        }
    }
    /**
     * Add event to history
     */
    addToHistory(event, payload) {
        if (!this.eventHistory.has(event)) {
            this.eventHistory.set(event, []);
        }
        const history = this.eventHistory.get(event);
        history.push(payload);
        if (history.length > this.maxHistorySize) {
            history.shift(); // Remove oldest
        }
    }
    /**
     * Get all registered events
     */
    getRegisteredEvents() {
        return this.eventNames().map(name => name.toString());
    }
}
// Singleton instance
exports.eventBus = new EventBus();
// Error handling
exports.eventBus.on('error', (error) => {
    console.error('EventBus error:', error);
});
exports.default = exports.eventBus;
//# sourceMappingURL=event-bus.js.map