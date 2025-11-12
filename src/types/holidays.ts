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