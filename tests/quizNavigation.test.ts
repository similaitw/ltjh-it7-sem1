// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

function navigate(hash: string) {
  history.replaceState(null, '', hash);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  return new Promise<void>((resolve) => queueMicrotask(() => queueMicrotask(() => resolve())));
}

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  await import('../src/main');
  await import('../src/handbookEnhancer');
  await import('../src/quizEnhancer');
  await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
});

beforeEach(() => {
  localStorage.clear();
});

describe('單元小測驗與教師頁', () => {
  it('每個正式單元會插入第 07 區小測驗', async () => {
    for (const lessonId of ['1-1','1-2','2-1','2-2','2-3','2-4','3-1','3-2','3-3','3-4']) {
      await navigate(`#/lesson/${lessonId}`);
      const section = document.querySelector<HTMLElement>('.quiz-section');
      expect(section?.dataset.quizLesson).toBe(lessonId);
      expect(section?.textContent).toContain('本節小測驗');
      expect(section?.textContent).toContain('80%');
    }
  });

  it('第一次測驗會要求班級、座號與姓名', async () => {
    await navigate('#/lesson/2-2');
    expect(document.querySelector('#student-profile-form')).not.toBeNull();
    expect(document.querySelectorAll('#student-profile-form input')).toHaveLength(3);
  });

  it('儲存學生資料後可開始五題測驗', async () => {
    await navigate('#/lesson/2-3');
    const form = document.querySelector<HTMLFormElement>('#student-profile-form')!;
    (form.elements.namedItem('className') as HTMLInputElement).value = '705';
    (form.elements.namedItem('seat') as HTMLInputElement).value = '12';
    (form.elements.namedItem('name') as HTMLInputElement).value = '測試學生';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    document.querySelector<HTMLButtonElement>('[data-start-quiz]')!.click();
    expect(document.querySelectorAll('.quiz-question')).toHaveLength(5);
  });

  it('教師管理路由可顯示本機版儀表板', async () => {
    await navigate('#/teacher');
    expect(document.querySelector('.teacher-page h1')?.textContent).toBe('教師管理頁');
    expect(document.querySelector('#teacher-import-files')).not.toBeNull();
    expect(document.querySelector('.teacher-nav')).not.toBeNull();
  });
});
