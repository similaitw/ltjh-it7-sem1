import './handbook.css';
import { chapters, lessons } from './content';
import { guideByLesson, pdfSources, type SourceRef, type StudyGuide } from './selfStudy';
import { lessonVisualHtml } from './lessonVisuals';

const sourceMap = Object.fromEntries(pdfSources.map((source) => [source.id, source]));

const sourceCoverage: Record<string, string[]> = {
  toc: [
    '全冊目次、教學節數與學期架構',
    '核心素養、學習內容／表現與課程對應',
    '教學資源、評量與課堂活動索引',
  ],
  l01: [
    'P.1–3：第 1 章章節規劃與教學提示',
    'P.4–20：1-1 食、衣、住、行、育、樂中的資訊科技',
    'P.21–30：1-2 資安、著作權、倫理、法律、媒體素養、資訊產業與詞彙',
    'P.31–38：資訊科技史、電腦設備、STEM／STEAM、機器人等補充資料',
  ],
  l02: [
    'P.1–14：第 2 章章節規劃、教學流程與學習重點',
    'P.15–24：2-1 演算法、流程圖與程式語言',
    'P.25–36：2-2 Scratch 介面、角色、舞臺、動畫與廣播',
    'P.37–53：2-3 IPO、變數、運算、循序、選擇、重複與計算題',
    'P.54–64：2-4 坐標、畫筆、正方形、擴散圖形與巢狀結構',
    'P.65–80：詞彙、參考解答與 Scratch 教學補充',
    'P.81–106：各節完整教學流程、操作步驟與題目說明',
  ],
  l03: [
    'P.1–10：第 3 章章節規劃、教學提示與專題架構',
    'P.11–12：3-1 專題規劃與問題界定',
    'P.13–14：3-2 Google 工具家族與登入',
    'P.15–36：3-3 搜尋技巧、Google 文件、試算表、公式、函式與圖表',
    'P.37–42：3-4 Google 簡報、圖片／影片與成果發表',
    'P.43–48：詞彙、LibreOffice Calc／Excel 儲存格等補充',
  ],
  appendix: [
    'P.1–3：App Inventor 補充教材與操作環境',
    'P.4–19：重複加法／乘法、四則運算、文字重複、1～N 累加等延伸實作',
  ],
  workbook: [
    'P.1–7：第 1 章問卷、是非／選擇、資訊科技與社群媒體素養題',
    'P.8–21：第 2 章流程圖、Scratch 動畫、計算與繪圖實作題',
    'P.22–28：第 3 章 Google 工具、公共自行車 CSV 與資料處理專題',
    'P.29–32：「海霸尋寶」運算思維桌遊與附件',
  ],
};

function escapeHtml(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function sourceRows(refs: SourceRef[]) {
  return refs.map((ref) => {
    const source = sourceMap[ref.source];
    return `<div class="pdf-source-item"><span class="pdf-source-title">${escapeHtml(source?.title ?? ref.source)}</span><span class="pdf-source-pages">PDF P.${escapeHtml(ref.pages)}</span><span class="pdf-source-note">${escapeHtml(ref.note)}</span></div>`;
  }).join('');
}

function selfStudyHtml(guide: StudyGuide) {
  return `<section class="self-study" aria-labelledby="self-study-title-${guide.lessonId}">
    <div class="self-study-header"><div><p class="eyebrow">PDF SELF-STUDY HANDBOOK</p><h2 id="self-study-title-${guide.lessonId}">完整自學講義</h2><p>依備課 PDF、附錄與教用習作重新整理。先理解，再照步驟實作，最後用練習檢查自己。</p></div><span class="self-study-badge">單元 ${guide.lessonId}</span></div>
    <div class="study-first"><h3>開始前，先知道這些</h3><ul>${guide.learnFirst.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
    ${lessonVisualHtml(guide.lessonId)}
    <div class="study-chapters">${guide.sections.map((section, index) => `<details class="study-block" ${index < 2 ? 'open' : ''}><summary>${escapeHtml(section.title)}</summary><div class="study-block-body">${section.intro ? `<p class="study-block-intro">${escapeHtml(section.intro)}</p>` : ''}<ul>${section.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></div></details>`).join('')}</div>
    <div class="study-do"><div class="study-steps"><h3>跟著做｜清楚步驟</h3><ol>${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></div><div class="study-practice"><h3>自己試試看</h3><ul>${guide.practice.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div></div>
    <div class="pdf-source-box"><h3>對照 PDF 原始來源</h3><div class="pdf-source-list">${sourceRows(guide.sourceRefs)}</div></div>
  </section>`;
}

function injectNavigation() {
  const overview = document.querySelector('.sidebar .overview');
  if (!overview || document.querySelector('.handbook-nav')) return;
  const link = document.createElement('a');
  link.className = `handbook-nav${location.hash === '#/handbook' ? ' active' : ''}`;
  link.href = '#/handbook';
  link.textContent = '完整自學講義';
  overview.insertAdjacentElement('afterend', link);
}

function injectHomeCard() {
  if (document.querySelector('.handbook-home-card')) return;
  const progress = document.querySelector('.progress-panel');
  if (!progress) return;
  progress.insertAdjacentHTML('afterend', `<section class="handbook-home-card"><div><p class="eyebrow">完整講義模式</p><h2>六冊 PDF 已整理成可自學的網站講義</h2><p>不只看摘要：每一節都有完整概念拆解、範例脈絡、照著做的步驟、練習題，以及原 PDF 頁碼。教材共 6 冊、272 頁，並把附錄與教用習作一併納入。</p></div><a href="#/handbook">打開完整講義 →</a></section>`);
}

function enhanceLesson() {
  const match = location.hash.match(/^#\/lesson\/(\d-\d)$/);
  if (!match) return;
  const guide = guideByLesson[match[1]];
  const activity = document.querySelector('.lesson-page .activity-section');
  if (!guide || !activity || document.querySelector('.self-study')) return;
  activity.insertAdjacentHTML('beforebegin', selfStudyHtml(guide));
}

function handbookHtml() {
  const totalPages = pdfSources.reduce((sum, source) => sum + source.pages, 0);
  const sourceCards = pdfSources.map((source) => `<article class="source-card"><div class="source-card-top"><h3>${escapeHtml(source.title)}</h3><strong>${source.pages} 頁</strong></div><p>${escapeHtml(source.file)}</p><ul class="coverage-list">${(sourceCoverage[source.id] ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`).join('');
  const unitCards = lessons.map((lesson) => {
    const chapter = chapters.find((item) => item.lessons.includes(lesson));
    const guide = guideByLesson[lesson.id];
    return `<article class="handbook-unit"><span class="handbook-unit-id">${lesson.id}</span><div><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(chapter?.title ?? '')} · ${guide?.sections.length ?? 0} 組深入講解 · ${guide?.steps.length ?? 0} 個實作步驟 · ${guide?.practice.length ?? 0} 組練習</p></div><a href="#/lesson/${lesson.id}">進入講義 →</a></article>`;
  }).join('');
  return `<div class="handbook-page"><a class="back-link" href="#/">← 回到課程總覽</a><section class="handbook-hero"><p class="eyebrow">COMPLETE SELF-STUDY HANDBOOK</p><h1>七上資訊科技・完整自學講義</h1><p>把備課資料、附錄與教用習作轉成學生可以自己讀懂的學習路線。每個概念都放回對應單元，用「先懂概念 → 看例子 → 跟著做 → 自己練習 → 對照 PDF 頁碼」的方式學習。</p><div class="handbook-stats"><span>6 冊 PDF</span><span>${totalPages} 頁來源</span><span>3 大章</span><span>10 個單元</span><span>附錄＋習作納入</span></div></section><section class="source-coverage"><h2>六冊 PDF 全部納入索引</h2><p>以下不是只列課文頁：章節規劃、教學補充、參考解答、詞彙、App Inventor 附錄、教用習作與運算思維桌遊，都保留在網站的來源地圖中。</p><div class="source-card-grid">${sourceCards}</div></section><section class="handbook-lessons"><h2>依單元開始自學</h2><p>進入任一單元後，「完整自學講義」會出現在原本課堂任務之前。前兩段預設展開，其他主題可逐段打開，避免一次看到太多文字。</p><div class="handbook-unit-list">${unitCards}</div></section><aside class="handbook-note"><strong>整理方式：</strong>網站保留教材的知識點、例題類型、操作流程與補充內容，但改寫成學生自學語氣與清楚步驟；原始 PDF 頁碼會留在每節最下方，方便教師回頭核對。</aside></div>`;
}

function renderHandbookRoute() {
  if (location.hash !== '#/handbook') return;
  const main = document.querySelector<HTMLElement>('#main');
  if (!main) return;
  main.innerHTML = handbookHtml();
  document.title = '完整自學講義｜資訊探險室・七上資訊科技';
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function enhance() {
  injectNavigation();
  if (location.hash === '#/handbook') {
    renderHandbookRoute();
    return;
  }
  injectHomeCard();
  enhanceLesson();
}

window.addEventListener('hashchange', () => queueMicrotask(enhance));
queueMicrotask(enhance);
