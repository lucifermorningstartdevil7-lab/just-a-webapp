// components/link-schedule-editor.tsx
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Clock } from "lucide-react";
import { LinkSchedule } from "../types/scheduling";

interface ScheduleEditorProps {
  schedule: LinkSchedule | null;
  onChange: (schedule: LinkSchedule | null) => void;
}

export function ScheduleEditor({ schedule, onChange }: ScheduleEditorProps) {
  const scheduleType = schedule?.type || 'always';

  return (
    <div className="space-y-4 p-4 border border-neutral-700 rounded-lg bg-neutral-800/50">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-neutral-400" />
        <Label className="text-neutral-300">Link Schedule</Label>
      </div>

      <Select value={scheduleType} onValueChange={(type) => {
        if (type === 'always') {
          onChange(null);
        } else {
          onChange({ type, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        }
      }}>
        <SelectTrigger className="bg-neutral-700 border-neutral-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-neutral-800 border-neutral-700">
          <SelectItem value="always">🟢 Always visible</SelectItem>
          <SelectItem value="specific_days">📅 Specific days</SelectItem>
          <SelectItem value="time_range">🕒 Time range</SelectItem>
          <SelectItem value="one_time">📆 One-time event</SelectItem>
        </SelectContent>
      </Select>

      {scheduleType === 'specific_days' && (
        <div className="space-y-2">
          <Label className="text-neutral-400 text-sm">Show on these days:</Label>
          <div className="flex gap-1 flex-wrap">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <Button
                key={day}
                type="button"
                variant={schedule?.days?.includes(index) ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => {
                  const days = schedule?.days || [];
                  const newDays = days.includes(index)
                    ? days.filter(d => d !== index)
                    : [...days, index];
                  onChange({ ...schedule, days: newDays });
                }}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      )}

      {scheduleType === 'time_range' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-neutral-400 text-sm">Start time</Label>
            <input
              type="time"
              value={schedule?.start_time || ''}
              onChange={(e) => onChange({ ...schedule, start_time: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 text-neutral-100"
            />
          </div>
          <div>
            <Label className="text-neutral-400 text-sm">End time</Label>
            <input
              type="time"
              value={schedule?.end_time || ''}
              onChange={(e) => onChange({ ...schedule, end_time: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 text-neutral-100"
            />
          </div>
        </div>
      )}

      {scheduleType === 'one_time' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-neutral-400 text-sm">Start date</Label>
            <input
              type="date"
              value={schedule?.start_date || ''}
              onChange={(e) => onChange({ ...schedule, start_date: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 text-neutral-100"
            />
          </div>
          <div>
            <Label className="text-neutral-400 text-sm">End date</Label>
            <input
              type="date"
              value={schedule?.end_date || ''}
              onChange={(e) => onChange({ ...schedule, end_date: e.target.value })}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 text-neutral-100"
            />
          </div>
        </div>
      )}

      {scheduleType !== 'always' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(null)}
          className="w-full text-red-400 border-red-800 hover:bg-red-950/20"
        >
          Remove Schedule
        </Button>
      )}
    </div>
  );
}