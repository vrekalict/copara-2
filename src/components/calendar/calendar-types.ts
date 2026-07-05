import type { SchedulePreset } from "@/lib/schedule/presets";

export type TemplateRow = {
  id: string;
  name: string;
  rrule: string | null;
  active: boolean;
};

export type ViolationRow = {
  id: string;
  kind: string;
  delta_minutes: number | null;
  detected_at: string;
  events: { title: string; starts_at: string } | { title: string; starts_at: string }[] | null;
};

export type ParentOption = {
  user_id: string;
  display_name: string | null;
};

export const PRESET_OPTIONS: SchedulePreset[] = [
  "week_on_off",
  "two_two_three",
  "alternating_weekends",
];
