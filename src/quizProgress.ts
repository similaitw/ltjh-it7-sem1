import { lessons } from './content';
import { PASSING_SCORE, QUIZ_LENGTH } from './quizData';

export const QUIZ_STORAGE_KEY = 'ltjh-it7-sem1:quiz-results:v1';
export const PROFILE_STORAGE_KEY = 'ltjh-it7-sem1:student-profile:v1';
export const TEACHER_IMPORT_KEY = 'ltjh-it7-sem1:teacher-imports:v1';

export type StudentProfile = {
  className: string;
  seat: string;
  name: string;
};

export type QuizAttempt = {
  id: string;
  lessonId: string;
  questionIds: string[];
  answers: number[];
  score: number;
  total: number;
  passed: boolean;
  conceptsToReview: string[];
  completedAt: string;
};

export type QuizState = {
  attempts: QuizAttempt[];
};

export type StudentRecordBundle = {
  version: 1;
  exportedAt: string;
  profile: StudentProfile;
  attempts: QuizAttempt[];
};

type ReadStorage = Pick<Storage, 'getItem'>;
type WriteStorage = Pick<Storage, 'setItem' | 'removeItem'>;

function parseObject(raw: string | null): unknown {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function readProfile(storage: ReadStorage): StudentProfile | null {
  const raw = parseObject(storage.getItem(PROFILE_STORAGE_KEY));
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.className !== 'string' || typeof value.seat !== 'string' || typeof value.name !== 'string') return null;
  return {
    className: value.className.trim(),
    seat: value.seat.trim(),
    name: value.name.trim(),
  };
}

export function saveProfile(storage: WriteStorage, profile: StudentProfile) {
  const clean = {
    className: profile.className.trim(),
    seat: profile.seat.trim(),
    name: profile.name.trim(),
  };
  if (!clean.className || !clean.seat || !clean.name) return false;
  try {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(clean));
    return true;
  } catch {
    return false;
  }
}

function isAttempt(value: unknown): value is QuizAttempt {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Partial<QuizAttempt>;
  return typeof item.id === 'string'
    && typeof item.lessonId === 'string'
    && Array.isArray(item.questionIds)
    && Array.isArray(item.answers)
    && typeof item.score === 'number'
    && typeof item.total === 'number'
    && typeof item.passed === 'boolean'
    && Array.isArray(item.conceptsToReview)
    && typeof item.completedAt === 'string';
}

export function readQuizState(storage: ReadStorage): QuizState {
  const raw = parseObject(storage.getItem(QUIZ_STORAGE_KEY));
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { attempts: [] };
  const attempts = Array.isArray((raw as QuizState).attempts)
    ? (raw as QuizState).attempts.filter(isAttempt)
    : [];
  return { attempts };
}

export function saveQuizState(storage: WriteStorage, state: QuizState) {
  try {
    storage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function addAttempt(storage: WriteStorage & ReadStorage, attempt: QuizAttempt) {
  const state = readQuizState(storage);
  state.attempts.push(attempt);
  return saveQuizState(storage, state);
}

export function attemptsForLesson(state: QuizState, lessonId: string) {
  return state.attempts.filter((attempt) => attempt.lessonId === lessonId);
}

export function quizSummary(state: QuizState, lessonId: string) {
  const attempts = attemptsForLesson(state, lessonId);
  const bestScore = attempts.reduce((best, attempt) => Math.max(best, attempt.score), 0);
  const passed = attempts.some((attempt) => attempt.passed);
  const lastAttempt = attempts.at(-1) ?? null;
  return {
    attempts: attempts.length,
    bestScore,
    passed,
    lastAttemptAt: lastAttempt?.completedAt ?? null,
  };
}

export function passedLessonCount(state: QuizState) {
  return lessons.filter((lesson) => quizSummary(state, lesson.id).passed).length;
}

export function createBundle(profile: StudentProfile, state: QuizState): StudentRecordBundle {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    attempts: state.attempts,
  };
}

export function isStudentRecordBundle(value: unknown): value is StudentRecordBundle {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const bundle = value as Partial<StudentRecordBundle>;
  return bundle.version === 1
    && typeof bundle.exportedAt === 'string'
    && !!bundle.profile
    && typeof bundle.profile.className === 'string'
    && typeof bundle.profile.seat === 'string'
    && typeof bundle.profile.name === 'string'
    && Array.isArray(bundle.attempts)
    && bundle.attempts.every(isAttempt);
}

export function recordKey(bundle: StudentRecordBundle) {
  return [bundle.profile.className.trim(), bundle.profile.seat.trim(), bundle.profile.name.trim()].join('|');
}

export function readTeacherImports(storage: ReadStorage): StudentRecordBundle[] {
  const raw = parseObject(storage.getItem(TEACHER_IMPORT_KEY));
  if (!Array.isArray(raw)) return [];
  return raw.filter(isStudentRecordBundle);
}

export function saveTeacherImports(storage: WriteStorage, bundles: StudentRecordBundle[]) {
  const deduped = new Map<string, StudentRecordBundle>();
  for (const bundle of bundles) {
    const key = recordKey(bundle);
    const existing = deduped.get(key);
    if (!existing || existing.exportedAt < bundle.exportedAt) deduped.set(key, bundle);
  }
  try {
    storage.setItem(TEACHER_IMPORT_KEY, JSON.stringify([...deduped.values()]));
    return true;
  } catch {
    return false;
  }
}

export function clearTeacherImports(storage: WriteStorage) {
  try {
    storage.removeItem(TEACHER_IMPORT_KEY);
    return true;
  } catch {
    return false;
  }
}

export function scoreLabel(score: number, total = QUIZ_LENGTH) {
  return `${score}/${total}`;
}

export function passLabel(score: number, total = QUIZ_LENGTH) {
  return score >= Math.min(PASSING_SCORE, total) ? '通過' : '未通過';
}
