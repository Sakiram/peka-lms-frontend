import { apiClient } from '../axios.config';
import type { CreateHolidayPayload, Holiday, UpdateHolidayPayload } from '@/types/holidays';

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

  createHoliday: async (payload: CreateHolidayPayload) => {
    const { data } = await apiClient.post('/holidays', payload);
    return data;
  },

  updateHoliday: async (id: string, payload: UpdateHolidayPayload) => {
    const { data } = await apiClient.put(`/holidays/${id}`, payload);
    return data;
  },

  deleteHoliday: async (id: string) => {
    const { data } = await apiClient.delete(`/holidays/${id}`);
    return data;
  },
};
