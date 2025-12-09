import api from './api';
import { Event, ApiResponse } from '../types';

export interface EventFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface EventStatistics {
  totalBooths: number;
  availableBooths: number;
  reservedBooths: number;
  bookedBooths: number;
  totalRevenue: number;
}

class EventService {
  /**
   * Get all events with optional filters
   */
  async getAllEvents(filters?: EventFilters): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>('/events', {
      params: filters
    });
    return response.data.data || [];
  }

  /**
   * Get active/published events only
   */
  async getActiveEvents(): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>('/events/active');
    return response.data.data || [];
  }

  /**
   * Get event by ID
   */
  async getEventById(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    if (!response.data.data) {
      throw new Error('Event not found');
    }
    return response.data.data;
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    venue?: string;
    status?: string;
  }): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>('/events', eventData);
    if (!response.data.data) {
      throw new Error('Failed to create event');
    }
    return response.data.data;
  }

  /**
   * Update an event
   */
  async updateEvent(id: string, eventData: Partial<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    venue: string;
    status: string;
  }>): Promise<Event> {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, eventData);
    if (!response.data.data) {
      throw new Error('Failed to update event');
    }
    return response.data.data;
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/events/${id}`);
  }

  /**
   * Get event statistics
   */
  async getEventStatistics(id: string): Promise<EventStatistics> {
    const response = await api.get<ApiResponse<{ statistics: EventStatistics }>>(`/events/${id}/statistics`);
    if (!response.data.data?.statistics) {
      throw new Error('Failed to fetch statistics');
    }
    return response.data.data.statistics;
  }
}

export default new EventService();

