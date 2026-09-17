import './style.css';
import { chapters, lessons, type Lesson } from './content';
import { checkedCount, isComplete, readProgress, resetProgress, saveProgress, type Progress } from './progress';

const app = document.querySelector<HTMLDivElement>('#app')!;
let progress: Progress = {};
let storage: Storage | undefined;
try { storage = window.localStorage; progress = readProgress(storage); } catch { /* Session-only progress still works. */ }

const arrow = '<span aria-hidden="true">↗</span>';
const lessonLink = (lesson: Lesson) => `#/lesson/${lesson.id}`;
const completeCount = () => lessons.filter((lesson) => isComplete(progress, lesson)).length;
const nextLesson = () => lessons.find((lesson) => !isComplete(progress, lesson)) ?? lessons[0];

function shell(content: string) {
  return `<a class="skip-link" href="#main">跳至主要內容</a>
    <header class="site-header"><a class="brand" href="#/" aria-label="資訊探險室首頁"><span class="brand-mark" aria-hidden="true">it<span>↗</span></span><span>資訊探險室<small>INFORMATION TECHNOLOGY LAB</small></span></a><span class="semester">七年級 <span>／</span> 上學期</span></header>
    <div class="layout"><aside class="sidebar"><p class="eyebrow">LEARNING MAP</p><a class="overview ${location.hash === '#/' || !location.hash ? 'active' : ''}" href="#/">▦ <span>課程總覽</span><span>10</span></a><nav aria-label="章節導覽">${chapters.map((chapter) => `<div class="nav-chapter"><a class="nav-title" href="#/chapter/${chapter.id}"><span>0${chapter.id}</span>${chapter.subtitle}</a>${chapter.lessons.map((lesson) => `<a class="nav-lesson ${location.hash === lessonLink(lesson) ? 'selected' : ''}" ${location.hash === lessonLink(lesson) ? 'aria-current="page"' : ''} href="${lessonLink(lesson)}"><span>${lesson.id}</span><span>${lesson.title}</span><span class="nav-check" data-nav-check="${lesson.id}" aria-label="${isComplete(progress, lesson) ? '已完成' : '未完成'}">${isComplete(progress, lesson) ? '✓' : ''}</span></a>`).join('')}</div>`).join('')}</nav><div class="sidebar-note"><span aria-hidden="true">✳</span><p>動手試試，<br>讓每個想法都有可能。</p><small>探索 · 實作 · 分享</small></div></aside><main id="main" tabindex="-1">${content}</main></div><footer>資訊探險室 <span>七上資訊科技 · 在課堂裡，探索數位世界。</span></footer><div class="toast" role="status" aria-live="polite"></div><dialog id="reset-dialog"><h2>重設學習進度？</h2><p>這會清除這個瀏覽器中全部 10 節的勾選紀錄，無法復原。</p><div class="dialog-actions"><button class="secondary" id="cancel-reset">保留進度</button><button class="danger" id="confirm-reset">確定重設</button></div></dialog>`;
}

function heroArt() {
  return `<div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-spark">✳</span><div class="code-window"><div class="window-bar"><i></i><i></i><i></i><span>idea → create</span></div><div class="code-body"><span class="code-comment">// 讓好奇心開始執行</span><span><b>when</b> 開始探索</span><span class="indent">想一想 <em>＋</em> 動手做</span><span class="indent">重複 <em>∞</em> 次嘗試</span><span><b>say</b>「我做到了！」</span></div></div><div class="coordinate"><span>y</span><div class="axis-x"></div><div class="axis-y"></div><i></i><b>x</b><small>(120, 80)</small></div><span class="art-label">YOUR IDEAS, IN MOTION.</span></div>`;
}

function chapterSection(chapter: typeof chapters[number]) {
  const completed = chapter.lessons.filter((lesson) => isComplete(progress, lesson)).length;
  return `<section class="chapter-section ${chapter.theme}" id="chapter-${chapter.id}" aria-labelledby="chapter-title-${chapter.id}"><div class="chapter-heading"><span class="chapter-number">0${chapter.id}</span><div><p class="eyebrow">CHAPTER 0${chapter.id} <span>／ ${chapter.subtitle}</span></p><h2 id="chapter-title-${chapter.id}">${chapter.title}</h2></div><span class="chapter-count">${completed} / ${chapter.lessons.length} 節完成</span></div><p class="chapter-description">${chapter.description}</p><div class="lesson-grid">${chapter.lessons.map((lesson) => {
    const count = checkedCount(progress, lesson);
    const status = isComplete(progress, lesson) ? '已完成' : count > 0 ? '探索中' : '開始探索';
    return `<a class="lesson-card" href="${lessonLink(lesson)}"><div class="card-top"><span class="lesson-number">${lesson.id}</span><span>${lesson.time}</span></div><h3>${lesson.title}</h3><p>${lesson.activity}</p><div class="card-bottom"><span class="lesson-status ${count ? 'started' : ''}">${count === lesson.checklist.length ? '✓' : '○'} ${status}</span>${arrow}</div></a>`;
  }).join('')}</div></section>`;
}

function home() {
  const completed = completeCount();
  return `<div class="page-kicker"><span>七上資訊科技 · 學習地圖</span><span>2026 · SEMESTER 01</span></div><section class="hero"><div class="hero-copy"><p class="eyebrow">HELLO, DIGITAL WORLD.</p><h1>從好奇出發，<br>把想法<span>做出來。</span></h1><p class="hero-description">認識數位世界，玩出程式邏輯。<br>一起用科技，完成屬於我們的園遊會！</p><a class="primary" href="${lessonLink(nextLesson())}">${completed === lessons.length ? '再次探索課程' : Object.values(progress).some((items) => items.some(Boolean)) ? '繼續我的探索' : '開始我的探索'} <span aria-hidden="true">→</span></a><div class="hero-meta"><span>03 大主題</span><span>10 個探索任務</span><span>在課堂中完成</span></div></div>${heroArt()}</section><section class="progress-panel" aria-label="學習進度"><div><span class="progress-symbol" aria-hidden="true">⚑</span><div><h2>我的探索進度 <strong>${completed}<small> / 10 節</small></strong></h2><p>${completed === lessons.length ? '探索完成！你已完成所有課堂任務。' : '每完成一份清單，就離新技能更近一步。'}</p></div></div><div class="progress-right"><progress max="10" value="${completed}" aria-label="已完成小節">${completed} / 10</progress><div><span>${storage ? '進度儲存在此瀏覽器' : '目前僅保留本次進度'}</span><button class="text-button" id="reset-progress">重設進度</button></div></div></section><div class="section-intro"><h2>你的探索路線</h2><span>從基礎出發，循序前進 <span aria-hidden="true">↓</span></span></div>${chapters.map(chapterSection).join('')}<section class="end-note"><span aria-hidden="true">✦</span><div><h2>不只學會工具，更練習解決問題。</h2><p>帶著問題開始，透過實作找答案，最後把你的發現分享給同學。</p></div></section>`;
}

function flowchart() {
  return `<figure class="flowchart"><figcaption>飲料攤點餐流程圖</figcaption><svg viewBox="0 0 560 430" role="img" aria-label="開始，輸入是否帶杯，判斷有帶杯嗎；是則金額設為25，否則設為30；兩條分支合流後顯示金額並結束。"><defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="currentColor" /></marker></defs><g class="flow-lines" marker-end="url(#arrowhead)"><path d="M280 46V70"/><path d="M280 112V138"/><path d="M196 180H110V229"/><path d="M364 180H450V229"/><path d="M110 275V298H280V318"/><path d="M450 275V298H280"/><path d="M280 360V382"/></g><rect class="flow-terminal" x="220" y="8" width="120" height="38" rx="19"/><path class="flow-io" d="M197 70H377L363 112H183Z"/><path class="flow-decision" d="M280 138L364 180L280 222L196 180Z"/><rect class="flow-process" x="30" y="229" width="160" height="46" rx="3"/><rect class="flow-process" x="370" y="229" width="160" height="46" rx="3"/><path class="flow-io" d="M207 318H367L353 360H193Z"/><rect class="flow-terminal" x="220" y="382" width="120" height="38" rx="19"/><g class="flow-text"><text x="280" y="33">開始</text><text x="280" y="97">輸入是否帶杯</text><text x="280" y="186">有帶杯嗎？</text><text x="110" y="258">金額設為 25</text><text x="450" y="258">金額設為 30</text><text x="280" y="345">顯示金額</text><text x="280" y="407">結束</text><text x="148" y="169">是</text><text x="412" y="169">否</text></g></svg></figure>`;
}

function lessonPage(lesson: Lesson) {
  const chapter = chapters.find((item) => item.lessons.includes(lesson))!;
  const index = lessons.indexOf(lesson);
  return `<article class="lesson-page ${chapter.theme}"><a class="back-link" href="#/">← 回到課程總覽</a><div class="lesson-header"><p class="eyebrow">CHAPTER 0${chapter.id} ／ ${chapter.subtitle}</p><div class="lesson-tag">探索任務 ${lesson.id} <span>· ${lesson.time}</span></div><h1>${lesson.title}</h1><p>${lesson.summary}</p></div><section class="concept-section"><h2><span>01</span> 先認識這些觀念</h2><div class="concept-grid">${lesson.concepts.map((concept) => `<div><h3>${concept.title}</h3><p>${concept.text}</p></div>`).join('')}</div>${lesson.id === '2-1' ? flowchart() : ''}${lesson.example ? `<div class="example"><h3>${lesson.example.title}</h3><pre>${lesson.example.lines.map((line) => line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')).join('\n')}</pre></div>` : ''}</section><section class="activity-section"><p class="eyebrow">LET’S MAKE IT HAPPEN</p><h2><span>02</span> 課堂活動：${lesson.activity}</h2><ol>${lesson.steps.map((step) => `<li>${step}</li>`).join('')}</ol>${lesson.resource ? `<a class="resource-link" href="${lesson.resource.url}" target="_blank" rel="noopener noreferrer">${lesson.resource.label} ${arrow}<span class="sr-only">（在新分頁開啟）</span></a>` : ''}</section><section class="completion-section"><h2><span>03</span> 完成條件</h2><p>${lesson.deliverable}</p><div class="checklist-heading"><h3>我的完成清單</h3><span id="checklist-count">${checkedCount(progress, lesson)} / ${lesson.checklist.length} 項</span></div><p class="checklist-hint">確認自己做到了，再勾選；全部勾選即完成本節。</p><div class="checklist">${lesson.checklist.map((item, i) => `<label><input type="checkbox" data-lesson="${lesson.id}" data-index="${i}" ${progress[lesson.id]?.[i] ? 'checked' : ''}><span>${item}</span></label>`).join('')}</div><p class="save-status" role="status">${storage ? '勾選後會自動儲存在此瀏覽器。' : '瀏覽器無法儲存，進度僅在本次開啟期間保留。'}</p></section><nav class="lesson-pagination" aria-label="前後小節">${index > 0 ? `<a href="${lessonLink(lessons[index - 1])}"><small>← 上一節</small>${lessons[index - 1].title}</a>` : '<a href="#/"><small>← 學習地圖</small>回到課程總覽</a>'}${index < lessons.length - 1 ? `<a href="${lessonLink(lessons[index + 1])}"><small>下一節 →</small>${lessons[index + 1].title}</a>` : '<a href="#/"><small>探索成果 →</small>查看我的進度</a>'}</nav></article>`;
}

function notify(message: string) { document.querySelector('.toast')!.textContent = message; }

function bindEvents() {
  document.querySelector('.skip-link')!.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector<HTMLElement>('#main')?.focus();
  });
  document.querySelectorAll<HTMLInputElement>('.checklist input').forEach((input) => input.addEventListener('change', () => {
    const lesson = lessons.find((item) => item.id === input.dataset.lesson)!;
    const checked = lesson.checklist.map((_, i) => progress[lesson.id]?.[i] === true);
    checked[Number(input.dataset.index)] = input.checked;
    progress[lesson.id] = checked;
    const saved = storage ? saveProgress(storage, progress) : false;
    document.querySelector('#checklist-count')!.textContent = `${checkedCount(progress, lesson)} / ${lesson.checklist.length} 項`;
    document.querySelector('.save-status')!.textContent = saved ? isComplete(progress, lesson) ? '本節已完成！進度已儲存。' : '進度已儲存。' : '無法儲存至瀏覽器；本次進度仍保留，重新整理後可能遺失。';
    const marker = document.querySelector(`[data-nav-check="${lesson.id}"]`)!;
    marker.textContent = isComplete(progress, lesson) ? '✓' : '';
    marker.setAttribute('aria-label', isComplete(progress, lesson) ? '已完成' : '未完成');
  }));
  const dialog = document.querySelector<HTMLDialogElement>('#reset-dialog')!;
  document.querySelector('#reset-progress')?.addEventListener('click', () => dialog.showModal());
  document.querySelector('#cancel-reset')!.addEventListener('click', () => dialog.close());
  document.querySelector('#confirm-reset')!.addEventListener('click', () => {
    if (storage && !resetProgress(storage)) {
      dialog.close(); notify('瀏覽器未允許清除儲存資料，原有進度仍保留，請稍後再試。'); return;
    }
    progress = {}; dialog.close(); render(false); notify('學習進度已重設。');
    document.querySelector<HTMLButtonElement>('#reset-progress')?.focus();
  });
}

function render(focus = false) {
  const route = !location.hash || location.hash === '#main' ? '#/' : location.hash;
  const lesson = lessons.find((item) => lessonLink(item) === route);
  const chapter = chapters.find((item) => route === `#/chapter/${item.id}`);
  const valid = route === '#/' || lesson || chapter;
  app.innerHTML = shell(lesson ? lessonPage(lesson) : valid ? home() : '<section class="not-found"><p class="eyebrow">404 / LOST IN EXPLORATION</p><h1>這個探索任務還不存在</h1><p>回到學習地圖，選擇一個課程繼續吧。</p><a class="primary" href="#/">回到課程總覽 →</a></section>');
  document.title = `${lesson ? lesson.title : '學習地圖'}｜資訊探險室・七上資訊科技`;
  bindEvents();
  if (focus) { document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  if (chapter) document.querySelector(`#chapter-${chapter.id}`)?.scrollIntoView({ behavior: 'instant' });
}

window.addEventListener('hashchange', () => render(true));
render();
