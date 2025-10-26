
export interface LinkSchedule {
  type: 'always' | 'specific_days' | 'time_range' | 'one_time';
  days?: number[]; // 0-6 (Sun-Sat)
  start_time?: string; // "14:30"
  end_time?: string; // "16:45"
  start_date?: string; // "2024-01-15"
  end_date?: string; // "2024-01-20"
  timezone?: string; // "UTC"
}



export interface LinkWithSchedule {
  id: string;
  title: string;
  url: string;
  schedule: LinkSchedule | null;
}