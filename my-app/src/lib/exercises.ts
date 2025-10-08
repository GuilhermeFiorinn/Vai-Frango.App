export type Exercise = {
  name: string;
  duration?: string;
  finished: boolean;
};

const STORAGE_KEY = "vf-calendar-events";

function isStringArray(v: any): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isExerciseArray(v: any): v is Exercise[] {
  return Array.isArray(v) && v.every((x) => x && typeof x.name === "string");
}

export function loadEvents(): Record<string, Exercise[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out: Record<string, Exercise[]> = {};
    for (const k of Object.keys(parsed)) {
      const val = parsed[k];
      if (isExerciseArray(val)) {
        out[k] = val;
      } else if (isStringArray(val)) {
        out[k] = val.map((s) => ({ name: s, duration: "", finished: false }));
      } else {
        out[k] = [];
      }
    }
    return out;
  } catch (e) {
    return {};
  }
}

export function saveEvents(events: Record<string, Exercise[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // eventual erro
  }
}

export function addExercise(
  events: Record<string, Exercise[]>,
  dateKey: string,
  exercise: Exercise
): Record<string, Exercise[]> {
  return { ...events, [dateKey]: [...(events[dateKey] || []), exercise] };
}

export function removeExercise(
  events: Record<string, Exercise[]>,
  dateKey: string,
  index: number
): Record<string, Exercise[]> {
  const arr = [...(events[dateKey] || [])];
  arr.splice(index, 1);
  return { ...events, [dateKey]: arr };
}
