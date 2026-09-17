import { describe, expect, it } from 'vitest';
import { appInventorAppendixHtml, practiceLabHtml } from '../src/supplementPages';

describe('附錄與教用習作自學頁', () => {
  it('App Inventor 附錄涵蓋介面、測試與五組實作', () => {
    const html = appInventorAppendixHtml();
    for (const phrase of [
      '組件面板',
      '程式設計區',
      '模擬器',
      '重複加法',
      '重複乘法',
      '四則運算',
      '文字重複',
      '1 ＋ 2 ＋ … ＋ N',
    ]) expect(html).toContain(phrase);
  });

  it('習作練習室涵蓋三章實作、公共自行車與海霸尋寶', () => {
    const html = practiceLabHtml();
    for (const phrase of [
      '智慧住宅想像',
      '勇者與惡龍動畫',
      '海霸尋寶桌遊',
      '公共自行車 CSV 資料專題',
      'Google 試算表',
      '柱狀圖',
    ]) expect(html).toContain(phrase);
  });

  it('延伸頁維持課堂使用，不新增課後繳交', () => {
    const html = appInventorAppendixHtml() + practiceLabHtml();
    expect(html).not.toContain('回家作業');
    expect(html).not.toContain('課後作業');
    expect(html).not.toContain('明天前繳交');
    expect(html).toContain('不另外安排課後繳交');
  });
});
