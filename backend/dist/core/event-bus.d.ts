/**
 * Event Bus System
 *
 * Central event bus for module-to-module communication.
 * Modules MUST communicate only via events - no direct calls.
 */
import { EventEmitter } from 'events';
export interface EventPayload {
    [key: string]: any;
    timestamp?: Date;
    module?: string;
}
export interface EventListener {
    (payload: EventPayload): void | Promise<void>;
}
declare class EventBus extends EventEmitter {
    private eventHistory;
    private maxHistorySize;
    constructor();
    /**
     * Emit an event (sync, matches EventEmitter signature)
     */
    emit(event: string, payload?: EventPayload): boolean;
    /**
     * Emit event and wait for all listeners to complete
     */
    emitAsync(event: string, payload?: EventPayload): Promise<void>;
    /**
     * Subscribe to an event
     */
    on(event: string, listener: EventListener): this;
    /**
     * Subscribe to an event once
     */
    once(event: string, listener: EventListener): this;
    /**
     * Unsubscribe from an event
     */
    off(event: string, listener: EventListener): this;
    /**
     * Get event history
     */
    getHistory(event?: string): EventPayload[];
    /**
     * Clear event history
     */
    clearHistory(event?: string): void;
    /**
     * Add event to history
     */
    private addToHistory;
    /**
     * Get all registered events
     */
    getRegisteredEvents(): string[];
}
export declare const eventBus: EventBus;
export default eventBus;
//# sourceMappingURL=event-bus.d.ts.map