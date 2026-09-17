import { describe, expect, it } from 'vitest';
import { lessonVisualHtml, visualLessonIds } from '../src/lessonVisuals';

describe('自學講義原生圖解', () => {
  it('三章十個單元都有原生圖解', () => {
    expect(visualLessonIds).toEqual(['1-1', '1-2', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4']);
  });

  it.each(visualLessonIds)('%s 圖解包含可辨識標題且不是空內容', (lessonId) => {
    const html = lessonVisualHtml(lessonId);
    expect(html).toContain('guided-visual');
    expect(html.length).toBeGreaterThan(300);
  });

  it('1-1 以六面向與過去現在未來整理生活科技', () => {
    const html = lessonVisualHtml('1-1');
    for (const phrase of ['食', '衣', '住', '行', '育', '樂', '過去', '現在', '未來']) expect(html).toContain(phrase);
  });

  it('1-2 有資料、資安、著作與媒體查證流程', () => {
    const html = lessonVisualHtml('1-2');
    for (const phrase of ['資料／隱私', '資訊安全', '著作權', '媒體判讀', '找第二個可信來源']) expect(html).toContain(phrase);
  });

  it('2-1 有四種流程圖基本符號與語言層次', () => {
    const html = lessonVisualHtml('2-1');
    for (const phrase of ['開始／結束', '處理', '輸入／輸出', '決策', '機器語言', '組合語言', '高階語言']) expect(html).toContain(phrase);
  });

  it('2-2 清楚呈現綠旗、重複、移動、造型與等待', () => {
    const html = lessonVisualHtml('2-2');
    for (const phrase of ['當綠旗被點擊', '重複 15 次', '移動 30 點', '下一個造型', '等待 0.3 秒']) {
      expect(html).toContain(phrase);
    }
  });

  it('2-3 保留 IPO、連乘與三組測試結果', () => {
    const html = lessonVisualHtml('2-3');
    for (const phrase of ['Input 輸入', 'Process 處理', 'Output 輸出', '乘積 設為 1', 'N = 5 → 120']) {
      expect(html).toContain(phrase);
    }
  });

  it('2-4 呈現座標、畫筆初始化與巢狀圖形', () => {
    const html = lessonVisualHtml('2-4');
    for (const phrase of ['(0,0)', '清除', '提筆', '下筆', '重複 4 次', '內層 3 次', '外層 12 次']) {
      expect(html).toContain(phrase);
    }
  });

  it('3-3 呈現搜尋語法、文件與試算表公式', () => {
    const html = lessonVisualHtml('3-3');
    for (const phrase of ['OR', 'site:gov.tw', 'Google 文件', 'Google 試算表', '=B2*C2', '=SUM(D2:D3)']) {
      expect(html).toContain(phrase);
    }
  });

  it('沒有把圖解變成課後作業', () => {
    const all = visualLessonIds.map(lessonVisualHtml).join('');
    expect(all).not.toContain('回家作業');
    expect(all).not.toContain('課後作業');
    expect(all).not.toContain('明天前繳交');
  });
});
