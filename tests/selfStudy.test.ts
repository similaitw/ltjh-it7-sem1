import { describe, expect, it } from 'vitest';
import { lessons } from '../src/content';
import { pdfSources, studyGuides } from '../src/selfStudy';

describe('PDF 自學講義完整性', () => {
  it('納入六冊 PDF，共 272 頁來源', () => {
    expect(pdfSources).toHaveLength(6);
    expect(pdfSources.reduce((sum, source) => sum + source.pages, 0)).toBe(272);
    expect(pdfSources.map((source) => source.id)).toEqual(['toc', 'l01', 'l02', 'l03', 'appendix', 'workbook']);
  });

  it('十個課堂單元都有一份自學講義', () => {
    expect(studyGuides).toHaveLength(10);
    expect(new Set(studyGuides.map((guide) => guide.lessonId))).toEqual(new Set(lessons.map((lesson) => lesson.id)));
  });

  it.each(studyGuides)('$lessonId 有導讀、深入講解、步驟、練習與來源頁碼', (guide) => {
    expect(guide.learnFirst.length).toBeGreaterThanOrEqual(3);
    expect(guide.sections.length).toBeGreaterThanOrEqual(3);
    expect(guide.sections.every((section) => section.points.length >= 2)).toBe(true);
    expect(guide.steps.length).toBeGreaterThanOrEqual(5);
    expect(guide.practice.length).toBeGreaterThanOrEqual(2);
    expect(guide.sourceRefs.length).toBeGreaterThanOrEqual(1);
    expect(guide.sourceRefs.every((ref) => ref.pages.length > 0 && ref.note.length > 0)).toBe(true);
  });

  it('主課文、附錄與教用習作都被至少一個單元引用', () => {
    const refs = new Set(studyGuides.flatMap((guide) => guide.sourceRefs.map((ref) => ref.source)));
    for (const source of ['l01', 'l02', 'l03', 'appendix', 'workbook']) expect(refs.has(source)).toBe(true);
  });
});
