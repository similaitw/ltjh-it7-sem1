import { describe, expect, it } from 'vitest';
import { chapters, lessons } from '../src/content';
import { checkedCount, isComplete, readProgress, resetProgress, saveProgress, STORAGE_KEY } from '../src/progress';

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe('課程內容', () => {
  it('包含教材對應的三章、十節與唯一的小節識別碼', () => {
    expect(chapters).toHaveLength(3);
    expect(chapters.map((chapter) => chapter.title)).toEqual(['資訊科技導論', '基礎程式設計', '資料處理應用專題']);
    expect(lessons).toHaveLength(10);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(10);
  });

  it.each(lessons)('$id 有目標、摘要、觀念、示範、課堂活動、完成條件與 checklist', (lesson) => {
    expect(lesson.objectives).toHaveLength(3);
    expect(lesson.summary.length).toBeGreaterThan(50);
    expect(lesson.concepts.length).toBeGreaterThanOrEqual(2);
    expect(lesson.example.lines.length).toBeGreaterThanOrEqual(3);
    expect(lesson.activity.length).toBeGreaterThan(0);
    expect(lesson.steps).toHaveLength(3);
    expect(lesson.deliverable.length).toBeGreaterThan(15);
    expect(lesson.checklist).toHaveLength(3);
  });

  it('第一章涵蓋生活應用與相關議題', () => {
    const intro = JSON.stringify(chapters[0]);
    for (const topic of ['食', '衣', '住', '行', '育', '樂', '資訊安全', '著作權', '法律', 'AI']) expect(intro).toContain(topic);
  });

  it('第二章涵蓋教材要求的演算法、Scratch 計算與繪圖內容', () => {
    const scratch = JSON.stringify(chapters[1]);
    for (const topic of ['流程圖', '機器語言', '組合語言', '循序', '選擇', '重複', '輸入', '處理', '輸出', '變數', '座標', '畫筆', '巢狀']) expect(scratch).toContain(topic);
  });

  it('第三章涵蓋專題規劃與 Google 園遊會資料處理流程', () => {
    const project = JSON.stringify(chapters[2]);
    for (const topic of ['專題規劃', 'Google 搜尋', 'Google 文件', 'Google 試算表', 'Google 簡報', 'OR', 'site:', '園遊會']) expect(project).toContain(topic);
  });
});

describe('學習進度', () => {
  it('可儲存、重新讀取與取消勾選', () => {
    const storage = memoryStorage();
    expect(readProgress(storage)).toEqual({});
    expect(saveProgress(storage, { '1-1': [true, false, true] })).toBe(true);
    expect(readProgress(storage)).toEqual({ '1-1': [true, false, true] });
    saveProgress(storage, { '1-1': [false, false, true] });
    expect(checkedCount(readProgress(storage), lessons[0])).toBe(1);
  });

  it('僅全數勾選才算完成', () => {
    expect(isComplete({}, lessons[0])).toBe(false);
    expect(isComplete({ '1-1': [true, false, true] }, lessons[0])).toBe(false);
    expect(isComplete({ '1-1': [true, true, true] }, lessons[0])).toBe(true);
  });

  it('重設僅清除本站進度', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{"1-1":[true,true,true]}', other: 'keep' });
    expect(resetProgress(storage)).toBe(true);
    expect(readProgress(storage)).toEqual({});
    expect(storage.getItem('other')).toBe('keep');
  });

  it.each(['invalid', 'null', '[]', '42', '"text"'])('損毀或非物件資料 %s 不會造成錯誤', (raw) => {
    expect(readProgress(memoryStorage({ [STORAGE_KEY]: raw }))).toEqual({});
  });

  it('只接受已知課程與布林值，並修正長度', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ '1-1': [true, 'true', 1, true], '1-2': [true], '2-1': 'bad', unknown: [true] }) });
    expect(readProgress(storage)).toEqual({ '1-1': [true, false, false], '1-2': [true, false, false] });
  });

  it('儲存空間不足或權限被拒時會回傳失敗，不會拋出例外', () => {
    const denied = () => { throw new Error('Storage unavailable'); };
    expect(readProgress({ getItem: denied })).toEqual({});
    expect(saveProgress({ setItem: denied, removeItem: denied }, {})).toBe(false);
    expect(resetProgress({ setItem: denied, removeItem: denied })).toBe(false);
  });
});
