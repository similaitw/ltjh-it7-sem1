import { lessons, type Lesson } from './content';

export const STORAGE_KEY = 'ltjh-it7-sem1:progress:v1';
export type Progress = Record<string, boolean[]>;
type StorageReader = Pick<Storage, 'getItem'>;
type StorageWriter = Pick<Storage, 'setItem' | 'removeItem'>;

export function readProgress(storage: StorageReader): Progress {
  try {
    const raw: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}');
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const result: Progress = {};
    for (const lesson of lessons) {
      const value = (raw as Record<string, unknown>)[lesson.id];
      if (Array.isArray(value)) result[lesson.id] = lesson.checklist.map((_, i) => value[i] === true);
    }
    return result;
  } catch {
    return {};
  }
}

export function saveProgress(storage: StorageWriter, progress: Progress): boolean {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}

export function resetProgress(storage: StorageWriter): boolean {
  try { storage.removeItem(STORAGE_KEY); return true; }
  catch { return false; }
}

export function checkedCount(progress: Progress, lesson: Lesson): number {
  return lesson.checklist.filter((_, i) => progress[lesson.id]?.[i] === true).length;
}

export function isComplete(progress: Progress, lesson: Lesson): boolean {
  return checkedCount(progress, lesson) === lesson.checklist.length;
}
