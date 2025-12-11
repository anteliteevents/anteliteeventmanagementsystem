import api from './api';
import { ApiResponse } from '../types';

export interface FloorPlan {
  id: string;
  eventId: string;
  name: string;
  imageUrl?: string;
  layoutData: {
    gridWidth: number;
    gridHeight: number;
    cellSize: number;
    shapes?: Array<{
      id: string;
      type: 'rectangle' | 'circle' | 'polygon';
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      strokeColor?: string;
      strokeWidth?: number;
      boothId?: string;
      boothNumber?: string;
      label?: string;
      metadata?: any;
    }>;
    zones?: Array<{
      id: string;
      name: string;
      color: string;
      x: number;
      y: number;
      width: number;
      height: number;
      booths: string[];
    }>;
    backgroundImage?: {
      url: string;
      opacity: number;
      x: number;
      y: number;
      scale: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFloorPlanInput {
  eventId: string;
  name: string;
  layoutData: FloorPlan['layoutData'];
  imageUrl?: string;
}

export interface UpdateFloorPlanInput {
  name?: string;
  layoutData?: FloorPlan['layoutData'];
  imageUrl?: string;
}

class FloorPlanService {
  /**
   * Get floor plan by ID
   */
  async getFloorPlanById(id: string): Promise<FloorPlan> {
    const response = await api.get<ApiResponse<FloorPlan>>(`/sales/floor-plans/${id}`);
    if (!response.data.data) {
      throw new Error('Floor plan not found');
    }
    return response.data.data;
  }

  /**
   * Get latest floor plan for an event
   */
  async getFloorPlan(eventId: string): Promise<FloorPlan | null> {
    try {
      const response = await api.get<ApiResponse<FloorPlan>>(`/sales/floor-plan/${eventId}`);
      return response.data.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all floor plans for an event
   */
  async getFloorPlansByEvent(eventId: string): Promise<FloorPlan[]> {
    const response = await api.get<ApiResponse<FloorPlan[]>>(`/sales/floor-plans/event/${eventId}`);
    return response.data.data || [];
  }

  /**
   * Create new floor plan
   */
  async createFloorPlan(input: CreateFloorPlanInput): Promise<FloorPlan> {
    const response = await api.post<ApiResponse<FloorPlan>>('/sales/floor-plans', input);
    if (!response.data.data) {
      throw new Error('Failed to create floor plan');
    }
    return response.data.data;
  }

  /**
   * Update floor plan
   */
  async updateFloorPlan(id: string, input: UpdateFloorPlanInput): Promise<FloorPlan> {
    const response = await api.put<ApiResponse<FloorPlan>>(`/sales/floor-plans/${id}`, input);
    if (!response.data.data) {
      throw new Error('Failed to update floor plan');
    }
    return response.data.data;
  }

  /**
   * Delete floor plan
   */
  async deleteFloorPlan(id: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<{ deleted: boolean }>>(`/sales/floor-plans/${id}`);
    return response.data.data?.deleted || false;
  }

  /**
   * Duplicate floor plan
   */
  async duplicateFloorPlan(id: string, newName?: string): Promise<FloorPlan> {
    const response = await api.post<ApiResponse<FloorPlan>>(`/sales/floor-plans/${id}/duplicate`, {
      name: newName
    });
    if (!response.data.data) {
      throw new Error('Failed to duplicate floor plan');
    }
    return response.data.data;
  }

  /**
   * Upload floor plan image
   */
  async uploadImage(file: File): Promise<{ filename: string; url: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<{ filename: string; url: string; originalName: string; size: number }>>(
      '/sales/floor-plans/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (!response.data.data) {
      throw new Error('Failed to upload image');
    }
    return response.data.data;
  }
}

export default new FloorPlanService();

