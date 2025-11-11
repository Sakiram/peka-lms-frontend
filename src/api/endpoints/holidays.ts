import { apiClient } from '../axios.config';

export interface Holiday {
  id: string;
  organization_id: string;
  name: string;
  holiday_date: string;
  recurring: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_upcoming?: boolean;
}

export interface CreateHolidayPayload {
  name: string;
  holiday_date: string;
  recurring: boolean;
}

export interface UpdateHolidayPayload {
  name: string;
  holiday_date: string;
  recurring: boolean;
}

export const holidaysAPI = {
  getUpcomingHolidays: async (): Promise<Holiday[]> => {
    const { data } = await apiClient.get<Holiday[]>('/holidays?next=30d');
    return data;
  },
  
  getCurrentHolidays: async (): Promise<Holiday[]> => {
    const { data } = await apiClient.get<Holiday[]>('/holidays');
    return data;
  },
  
  getAllHolidays: async (allYears: boolean = false): Promise<Holiday[]> => {
    const url = allYears ? '/holidays?all=true' : '/holidays';
    const { data } = await apiClient.get<Holiday[]>(url);
    return data;
  },
  // Create holiday
  createHoliday: async (payload: CreateHolidayPayload) => {
    const { data } = await apiClient.post('/holidays', payload);
    return data;
  },

  // Update holiday
  updateHoliday: async (id: string, payload: UpdateHolidayPayload) => {
    const { data } = await apiClient.put(`/holidays/${id}`, payload);
    return data;
  },

  // Delete holiday
  deleteHoliday: async (id: string) => {
    const { data } = await apiClient.delete(`/holidays/${id}`);
    return data;
  },
};
