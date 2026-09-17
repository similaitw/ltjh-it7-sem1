// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from 'vitest';

function navigate(hash: string) {
  history.replaceState(null, '', hash);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  return new Promise<void>((resolve) => queueMicrotask(() => resolve()));
}

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  await import('../src/main');
  await import('../src/handbookEnhancer');
  await new Promise<void>((resolve) => queueMicrotask(() => resolve()));
});

describe('完整自學講義介面', () => {
  it('首頁顯示完整講義入口', async () => {
    await navigate('#/');
    expect(document.querySelector('.handbook-home-card')?.textContent).toContain('六冊 PDF');
    expect(document.querySelector<HTMLAnchorElement>('.handbook-home-card a')?.hash).toBe('#/handbook');
    expect(document.querySelector('.handbook-nav')?.textContent).toContain('完整自學講義');
  });

  it('完整講義頁顯示六冊來源與十個單元', async () => {
    await navigate('#/handbook');
    expect(document.querySelector('.handbook-hero h1')?.textContent).toContain('完整自學講義');
    expect(document.querySelectorAll('.source-card')).toHaveLength(6);
    expect(document.querySelectorAll('.handbook-unit')).toHaveLength(10);
    expect(document.querySelector('.handbook-stats')?.textContent).toContain('272 頁來源');
  });

  it('每個課程頁都插入自學講義與清楚步驟', async () => {
    for (const lessonId of ['1-1', '1-2', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4']) {
      await navigate(`#/lesson/${lessonId}`);
      expect(document.querySelector('.self-study')).not.toBeNull();
      expect(document.querySelectorAll('.study-block').length).toBeGreaterThanOrEqual(3);
      expect(document.querySelectorAll('.study-steps li').length).toBeGreaterThanOrEqual(5);
      expect(document.querySelectorAll('.study-practice li').length).toBeGreaterThanOrEqual(2);
      expect(document.querySelector('.pdf-source-box')?.textContent).toContain('PDF P.');
    }
  });
});
