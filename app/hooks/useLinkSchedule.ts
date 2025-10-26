
import { useMemo } from 'react';
import { LinkWithSchedule } from '../types/scheduling';

export function useLinkSchedule(links: LinkWithSchedule[]) {
  const getActiveLinks = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); 
    
    return links.filter(link => {
      if (!link.schedule || link.schedule.type === 'always') {
        return true;
      }

      const { schedule } = link;
      
      switch (schedule.type) {
        case 'specific_days':
          return schedule.days?.includes(currentDay) ?? true;
          
        case 'time_range':
          if (!schedule.start_time || !schedule.end_time) return true;
          return currentTime >= schedule.start_time && currentTime <= schedule.end_time;
          
        case 'one_time':
          if (!schedule.start_date || !schedule.end_date) return true;
          const currentDate = now.toISOString().split('T')[0];
          return currentDate >= schedule.start_date && currentDate <= schedule.end_date;
          
        default:
          return true;
      }
    });
  }, [links]);

  return { getActiveLinks };
}