export type SchedulePreset =
  | "week_on_off"
  | "two_two_three"
  | "alternating_weekends";

export type GeneratedEvent = {
  title: string;
  type: "parenting_time";
  starts_at: string;
  ends_at: string;
  responsible_parent: string;
  circle_id: string;
  created_by: string;
};

const PRESET_CYCLE: Record<SchedulePreset, number[]> = {
  two_two_three: [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
  week_on_off: [],
  alternating_weekends: [],
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toIso(date: Date) {
  return date.toISOString();
}

function parentForDay(
  preset: SchedulePreset,
  dayIndex: number,
  weekIndex: number,
  parentAId: string,
  parentBId: string,
) {
  if (preset === "two_two_three") {
    const slot = PRESET_CYCLE.two_two_three[dayIndex % PRESET_CYCLE.two_two_three.length];
    return slot === 0 ? parentAId : parentBId;
  }
  if (preset === "week_on_off") {
    return weekIndex % 2 === 0 ? parentAId : parentBId;
  }
  return dayIndex % 2 === 0 ? parentAId : parentBId;
}

export function generatePresetEvents(options: {
  preset: SchedulePreset;
  circleId: string;
  parentAId: string;
  parentBId: string;
  createdBy: string;
  startDate?: Date;
  weeks?: number;
}): GeneratedEvent[] {
  const start = startOfDay(options.startDate ?? new Date());
  const weeks = options.weeks ?? 4;
  const events: GeneratedEvent[] = [];

  if (options.preset === "alternating_weekends") {
    for (let w = 0; w < weeks; w++) {
      const fri = addDays(start, w * 7 + ((5 - start.getDay() + 7) % 7));
      const sun = addDays(fri, 2);
      fri.setHours(17, 0, 0, 0);
      sun.setHours(17, 0, 0, 0);
      const parent = w % 2 === 0 ? options.parentAId : options.parentBId;
      events.push({
        title: "Weekend parenting time",
        type: "parenting_time",
        starts_at: toIso(fri),
        ends_at: toIso(sun),
        responsible_parent: parent,
        circle_id: options.circleId,
        created_by: options.createdBy,
      });
    }
    return events;
  }

  if (options.preset === "week_on_off") {
    for (let w = 0; w < weeks; w++) {
      const weekStart = addDays(start, w * 7);
      const weekEnd = addDays(weekStart, 7);
      weekStart.setHours(9, 0, 0, 0);
      weekEnd.setHours(9, 0, 0, 0);
      const parent = parentForDay("week_on_off", 0, w, options.parentAId, options.parentBId);
      events.push({
        title: "Parenting week",
        type: "parenting_time",
        starts_at: toIso(weekStart),
        ends_at: toIso(weekEnd),
        responsible_parent: parent,
        circle_id: options.circleId,
        created_by: options.createdBy,
      });
    }
    return events;
  }

  const totalDays = weeks * 7;
  for (let d = 0; d < totalDays; d++) {
    const dayStart = addDays(start, d);
    const dayEnd = addDays(dayStart, 1);
    dayStart.setHours(9, 0, 0, 0);
    dayEnd.setHours(9, 0, 0, 0);
    const parent = parentForDay(
      "two_two_three",
      d,
      Math.floor(d / 7),
      options.parentAId,
      options.parentBId,
    );
    events.push({
      title: "Parenting day",
      type: "parenting_time",
      starts_at: toIso(dayStart),
      ends_at: toIso(dayEnd),
      responsible_parent: parent,
      circle_id: options.circleId,
      created_by: options.createdBy,
    });
  }

  return events;
}

export const PRESET_LABELS: Record<SchedulePreset, string> = {
  week_on_off: "Week on / week off",
  two_two_three: "2-2-3",
  alternating_weekends: "Alternating weekends",
};
