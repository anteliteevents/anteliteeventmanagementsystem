"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class EventModel {
    /**
     * Get event by ID
     */
    async findById(id) {
        const query = 'SELECT * FROM events WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    /**
     * Get all active events
     */
    async findActive() {
        const query = `
      SELECT * FROM events 
      WHERE status IN ('published', 'active')
      ORDER BY start_date ASC
    `;
        const result = await database_1.default.query(query);
        return result.rows;
    }
}
exports.default = new EventModel();
//# sourceMappingURL=event.model.js.map