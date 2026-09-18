import { describe, expect, it } from 'vitest';
import { lessons } from '../src/content';
import { PASSING_SCORE, QUIZ_LENGTH, pickQuiz, quizBank } from '../src/quizData';
import {
  QUIZ_STORAGE_KEY,
  addAttempt,
  createBundle,
  passedLessonCount,
  quizSummary,
  readQuizState,
  saveProfile,
  readProfile,
  type StudentProfile,
} from '../src/quizProgress';

class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}

describe('單元小測驗題庫', () => {
  it('10 個正式單元各有 10 題，共 100 題', () => {
    expect(Object.keys(quizBank)).toHaveLength(10);
    expect(lessons).toHaveLength(10);
    for (const lesson of lessons) expect(quizBank[lesson.id]).toHaveLength(10);
    expect(Object.values(quizBank).flat()).toHaveLength(100);
  });

  it('所有題目答案索引有效、id 唯一且有概念與來源', () => {
    const questions = Object.values(quizBank).flat();
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
    for (const question of questions) {
      expect(question.lessonId).toBeTruthy();
      expect(question.prompt.length).toBeGreaterThan(4);
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.options.length);
      expect(question.concept).toBeTruthy();
      expect(question.explanation).toBeTruthy();
      expect(question.source).toBeTruthy();
    }
  });

  it('每次抽 5 題且不重複，4/5 為通過門檻', () => {
    const questions = pickQuiz('2-3', QUIZ_LENGTH, () => 0.42);
    expect(questions).toHaveLength(5);
    expect(new Set(questions.map((question) => question.id)).size).toBe(5);
    expect(PASSING_SCORE).toBe(4);
  });
});

describe('測驗進度與學生紀錄', () => {
  it('可儲存學生班級、座號與姓名', () => {
    const storage = new MemoryStorage();
    const profile: StudentProfile = { className: '705', seat: '12', name: '王小明' };
    expect(saveProfile(storage, profile)).toBe(true);
    expect(readProfile(storage)).toEqual(profile);
  });

  it('記錄嘗試次數、最高分與是否通過', () => {
    const storage = new MemoryStorage();
    const base = {
      lessonId: '1-1',
      questionIds: ['a','b','c','d','e'],
      answers: [0,0,0,0,0],
      total: 5,
      conceptsToReview: [],
    };
    addAttempt(storage, { ...base, id: 'a1', score: 3, passed: false, completedAt: '2026-09-18T00:00:00Z' });
    addAttempt(storage, { ...base, id: 'a2', score: 4, passed: true, completedAt: '2026-09-18T00:05:00Z' });
    const state = readQuizState(storage);
    expect(JSON.parse(storage.getItem(QUIZ_STORAGE_KEY) ?? '{}').attempts).toHaveLength(2);
    expect(quizSummary(state, '1-1')).toMatchObject({ attempts: 2, bestScore: 4, passed: true });
    expect(passedLessonCount(state)).toBe(1);
  });

  it('匯出紀錄包含學生資料與所有嘗試', () => {
    const storage = new MemoryStorage();
    const profile = { className: '701', seat: '1', name: '學生甲' };
    saveProfile(storage, profile);
    const bundle = createBundle(profile, readQuizState(storage));
    expect(bundle.version).toBe(1);
    expect(bundle.profile).toEqual(profile);
    expect(bundle.attempts).toEqual([]);
  });
});
