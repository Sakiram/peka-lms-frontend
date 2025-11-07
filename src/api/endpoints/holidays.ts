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

export const holidaysAPI = {
  getUpcomingHolidays: async (): Promise<Holiday[]> => {
    const { data } = await apiClient.get<Holiday[]>('/holidays?next=30d');
    return data;
  },
  
  getAllHolidays: async (): Promise<Holiday[]> => {
    const { data } = await apiClient.get<Holiday[]>('/holidays');
    return data;
  },
};
