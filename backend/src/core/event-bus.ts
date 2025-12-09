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

class EventBus extends EventEmitter {
  private eventHistory: Map<string, EventPayload[]> = new Map();
  private maxHistorySize = 100;

  constructor() {
    super();
    this.setMaxListeners(100); // Allow many listeners
  }

  /**
   * Emit an event (async-safe)
   */
  async emit(event: string, payload: EventPayload = {}): Promise<boolean> {
    const enrichedPayload: EventPayload = {
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
  async emitAsync(event: string, payload: EventPayload = {}): Promise<void> {
    const enrichedPayload: EventPayload = {
      ...payload,
      timestamp: new Date(),
      module: payload.module || 'unknown'
    };

    this.addToHistory(event, enrichedPayload);

    const listeners = this.listeners(event) as EventListener[];
    const promises = listeners.map(listener => {
      try {
        const result = listener(enrichedPayload);
        return result instanceof Promise ? result : Promise.resolve();
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Subscribe to an event
   */
  on(event: string, listener: EventListener): this {
    return super.on(event, listener);
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, listener: EventListener): this {
    return super.once(event, listener);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, listener: EventListener): this {
    return super.off(event, listener);
  }

  /**
   * Get event history
   */
  getHistory(event?: string): EventPayload[] {
    if (event) {
      return this.eventHistory.get(event) || [];
    }
    const allEvents: EventPayload[] = [];
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
  clearHistory(event?: string): void {
    if (event) {
      this.eventHistory.delete(event);
    } else {
      this.eventHistory.clear();
    }
  }

  /**
   * Add event to history
   */
  private addToHistory(event: string, payload: EventPayload): void {
    if (!this.eventHistory.has(event)) {
      this.eventHistory.set(event, []);
    }
    const history = this.eventHistory.get(event)!;
    history.push(payload);
    if (history.length > this.maxHistorySize) {
      history.shift(); // Remove oldest
    }
  }

  /**
   * Get all registered events
   */
  getRegisteredEvents(): string[] {
    return this.eventNames().map(name => name.toString());
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Error handling
eventBus.on('error', (error: Error) => {
  console.error('EventBus error:', error);
});

export default eventBus;

