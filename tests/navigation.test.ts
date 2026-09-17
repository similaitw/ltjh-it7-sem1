// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { lessons } from '../src/content';
import { STORAGE_KEY } from '../src/progress';

function navigate(hash: string) {
  history.replaceState(null, '', hash);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

function click(selector: string) {
  const target = document.querySelector<HTMLElement>(selector);
  expect(target, selector).not.toBeNull();
  target!.click();
}

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  await import('../src/main');
});

beforeEach(() => {
  navigate('#/');
  click('#reset-progress');
  click('#confirm-reset');
});

describe('頁面與互動', () => {
  it('首頁可以進入全部十節，每頁呈現固定教學結構與清單', () => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.lesson-card')].map((link) => link.hash);
    expect(links).toHaveLength(10);
    for (const hash of links) {
      navigate(hash);
      const lesson = lessons.find((item) => hash.endsWith(item.id))!;
      expect(document.querySelector('.lesson-header h1')?.textContent).toBe(lesson.title);
      expect(document.querySelectorAll('.objective-list li')).toHaveLength(3);
      expect(document.querySelectorAll('.concept-section .concept-grid > div').length).toBeGreaterThanOrEqual(2);
      expect(document.querySelector('.demo-section .example')).not.toBeNull();
      expect(document.querySelectorAll('.activity-section li')).toHaveLength(3);
      expect(document.querySelectorAll('.checklist input')).toHaveLength(3);
      expect(document.querySelector('.completion-section')).not.toBeNull();
    }
  });

  it('勾選會保存、更新導覽與首頁完成數，取消勾選會撤銷完成', () => {
    navigate('#/lesson/1-1');
    document.querySelectorAll<HTMLInputElement>('.checklist input').forEach((input) => input.click());
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ '1-1': [true, true, true] });
    expect(document.querySelector('.save-status')?.textContent).toContain('本節已完成');
    expect(document.querySelector('[data-nav-check="1-1"]')?.textContent).toBe('✓');
    navigate('#/');
    expect(document.querySelector('progress')?.value).toBe(1);
    navigate('#/lesson/1-1');
    expect(document.querySelectorAll('input:checked')).toHaveLength(3);
    click('.checklist input');
    navigate('#/');
    expect(document.querySelector('progress')?.value).toBe(0);
  });

  it('重設可取消，確認時清除本站資料但保留其他儲存項目', () => {
    localStorage.setItem('another-app', 'keep');
    navigate('#/lesson/1-1');
    click('.checklist input');
    navigate('#/');
    click('#reset-progress');
    expect(document.querySelector('dialog')?.open).toBe(true);
    click('#cancel-reset');
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    click('#reset-progress');
    click('#confirm-reset');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem('another-app')).toBe('keep');
    expect(document.querySelector('progress')?.value).toBe(0);
    expect(document.activeElement?.id).toBe('reset-progress');
  });

  it('未知小節顯示可返回首頁的訊息', () => {
    navigate('#/lesson/missing');
    expect(document.querySelector('h1')?.textContent).toContain('不存在');
    expect(document.querySelector('.not-found a')?.getAttribute('href')).toBe('#/');
  });

  it('跳至主要內容不改變課程路由，直接開啟 #main 也不會空白', () => {
    navigate('#/lesson/2-1');
    click('.skip-link');
    expect(document.activeElement?.id).toBe('main');
    expect(location.hash).toBe('#/lesson/2-1');
    navigate('#main');
    expect(document.querySelectorAll('.lesson-card')).toHaveLength(10);
  });

  it('流程圖可被輔助技術辨識，外部工具採新分頁且保護 opener', () => {
    navigate('#/lesson/2-1');
    expect(document.querySelector('svg[role="img"]')?.getAttribute('aria-label')).toContain('判斷');
    navigate('#/lesson/3-3');
    const resource = document.querySelector<HTMLAnchorElement>('.resource-link')!;
    expect(resource.target).toBe('_blank');
    expect(resource.rel).toContain('noopener');
  });

  it('首頁明確標示所有任務在課堂中完成', () => {
    navigate('#/');
    expect(document.body.textContent).toContain('不安排課後繳交');
    expect(document.body.textContent).toContain('課堂中完成');
  });

  it('儲存失敗會保留本次勾選並顯示錯誤提示', () => {
    const denied = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    navigate('#/lesson/1-1');
    click('.checklist input');
    expect(document.querySelector('.save-status')?.textContent).toContain('無法儲存');
    expect(document.querySelectorAll('input:checked')).toHaveLength(1);
    denied.mockRestore();
  });
});
