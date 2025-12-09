import { Event } from '../types';
declare class EventModel {
    /**
     * Get event by ID
     */
    findById(id: string): Promise<Event | null>;
    /**
     * Get all active events
     */
    findActive(): Promise<Event[]>;
}
declare const _default: EventModel;
export default _default;
//# sourceMappingURL=event.model.d.ts.map