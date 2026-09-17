import './style.css';
import { chapters, lessons, type Lesson } from './content';
import { checkedCount, isComplete, readProgress, resetProgress, saveProgress, type Progress } from './progress';

const app = document.querySelector<HTMLDivElement>('#app')!;
let progress: Progress = {};
let storage: Storage | undefined;

try {
  storage = window.localStorage;
  progress = readProgress(storage);
} catch {
  // 若瀏覽器停用儲存，仍保留本次頁面中的勾選狀態。
}

const arrow = '<span aria-hidden="true">↗</span>';
const lessonLink = (lesson: Lesson) => `#/lesson/${lesson.id}`;
const completeCount = () => lessons.filter((lesson) => isComplete(progress, lesson)).length;
const nextLesson = () => lessons.find((lesson) => !isComplete(progress, lesson)) ?? lessons[0];

function shell(content: string) {
  return `<a class="skip-link" href="#main">跳至主要內容</a>
    <header class="site-header">
      <a class="brand" href="#/" aria-label="資訊探險室首頁"><span class="brand-mark" aria-hidden="true">it<span>↗</span></span><span>資訊探險室<small>INFORMATION TECHNOLOGY LAB</small></span></a>
      <span class="semester">七年級 <span>／</span> 上學期</span>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <p class="eyebrow">LEARNING MAP</p>
        <a class="overview ${location.hash === '#/' || !location.hash ? 'active' : ''}" href="#/">▦ <span>課程總覽</span><span>10</span></a>
        <nav aria-label="章節導覽">${chapters.map((chapter) => `<div class="nav-chapter"><a class="nav-title" href="#/chapter/${chapter.id}"><span>0${chapter.id}</span>${chapter.title}</a>${chapter.lessons.map((lesson) => `<a class="nav-lesson ${location.hash === lessonLink(lesson) ? 'selected' : ''}" ${location.hash === lessonLink(lesson) ? 'aria-current="page"' : ''} href="${lessonLink(lesson)}"><span>${lesson.id}</span><span>${lesson.title}</span><span class="nav-check" data-nav-check="${lesson.id}" aria-label="${isComplete(progress, lesson) ? '已完成' : '未完成'}">${isComplete(progress, lesson) ? '✓' : ''}</span></a>`).join('')}</div>`).join('')}</nav>
        <div class="sidebar-note"><span aria-hidden="true">✳</span><p>課堂中完成，<br>一步一步留下學習紀錄。</p><small>理解 · 實作 · 檢核</small></div>
      </aside>
      <main id="main" tabindex="-1">${content}</main>
    </div>
    <footer>資訊探險室 <span>七上資訊科技 · 所有任務都在課堂中完成。</span></footer>
    <div class="toast" role="status" aria-live="polite"></div>
    <dialog id="reset-dialog"><h2>重設學習進度？</h2><p>這會清除這個瀏覽器中全部 10 節的勾選紀錄，無法復原。</p><div class="dialog-actions"><button class="secondary" id="cancel-reset">保留進度</button><button class="danger" id="confirm-reset">確定重設</button></div></dialog>`;
}

function heroArt() {
  return `<div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-spark">✳</span><div class="code-window"><div class="window-bar"><i></i><i></i><i></i><span>idea → create</span></div><div class="code-body"><span class="code-comment">// 先理解，再實作</span><span><b>when</b> 課堂開始</span><span class="indent">觀察 <em>＋</em> 思考</span><span class="indent">設計 <em>＋</em> 測試</span><span><b>say</b>「我知道為什麼！」</span></div></div><div class="coordinate"><span>y</span><div class="axis-x"></div><div class="axis-y"></div><i></i><b>x</b><small>(120, 80)</small></div><span class="art-label">LEARN BY MAKING.</span></div>`;
}

function chapterSection(chapter: typeof chapters[number]) {
  const completed = chapter.lessons.filter((lesson) => isComplete(progress, lesson)).length;
  return `<section class="chapter-section ${chapter.theme}" id="chapter-${chapter.id}" aria-labelledby="chapter-title-${chapter.id}">
    <div class="chapter-heading"><span class="chapter-number">0${chapter.id}</span><div><p class="eyebrow">CHAPTER 0${chapter.id} <span>／ ${chapter.subtitle}</span></p><h2 id="chapter-title-${chapter.id}">${chapter.title}</h2></div><span class="chapter-count">${completed} / ${chapter.lessons.length} 節完成</span></div>
    <p class="chapter-description">${chapter.description}</p>
    <div class="lesson-grid">${chapter.lessons.map((lesson) => {
      const count = checkedCount(progress, lesson);
      const status = isComplete(progress, lesson) ? '已完成' : count > 0 ? '進行中' : '開始學習';
      return `<a class="lesson-card" href="${lessonLink(lesson)}"><div class="card-top"><span class="lesson-number">${lesson.id}</span><span>${lesson.time}</span></div><h3>${lesson.title}</h3><p>${lesson.activity}</p><div class="card-bottom"><span class="lesson-status ${count ? 'started' : ''}">${count === lesson.checklist.length ? '✓' : '○'} ${status}</span>${arrow}</div></a>`;
    }).join('')}</div>
  </section>`;
}

function home() {
  const completed = completeCount();
  const started = Object.values(progress).some((items) => items.some(Boolean));
  return `<div class="page-kicker"><span>七上資訊科技 · 學習地圖</span><span>115 學年度 · 上學期</span></div>
    <section class="hero"><div class="hero-copy"><p class="eyebrow">HELLO, DIGITAL WORLD.</p><h1>從生活出發，<br>把問題<span>做出解法。</span></h1><p class="hero-description">先認識資訊科技，再用 Scratch 練習程式思維，最後完成園遊會資料處理專題。</p><a class="primary" href="${lessonLink(nextLesson())}">${completed === lessons.length ? '再次瀏覽課程' : started ? '繼續學習' : '開始第一節'} <span aria-hidden="true">→</span></a><div class="hero-meta"><span>03 大章</span><span>10 個課堂單元</span><span>不安排課後繳交</span></div></div>${heroArt()}</section>
    <section class="progress-panel" aria-label="學習進度"><div><span class="progress-symbol" aria-hidden="true">⚑</span><div><h2>我的課堂進度 <strong>${completed}<small> / 10 節</small></strong></h2><p>${completed === lessons.length ? '全部完成！可以回頭複習任一單元。' : '每節完成三項檢核，就會記錄為已完成。'}</p></div></div><div class="progress-right"><progress max="10" value="${completed}" aria-label="已完成小節">${completed} / 10</progress><div><span>${storage ? '進度儲存在此瀏覽器' : '目前僅保留本次進度'}</span><button class="text-button" id="reset-progress">重設進度</button></div></div></section>
    <div class="section-intro"><h2>本學期課程</h2><span>依章節進行，也可直接開啟指定單元 <span aria-hidden="true">↓</span></span></div>
    ${chapters.map(chapterSection).join('')}
    <section class="end-note"><span aria-hidden="true">✦</span><div><h2>理解概念、動手操作、當堂檢核。</h2><p>每個單元都保留可在課堂內完成的任務與完成條件，不需要另外帶回去繳交。</p></div></section>`;
}

function flowchart() {
  return `<figure class="flowchart"><figcaption>熱狗製作流程圖示例</figcaption><svg viewBox="0 0 560 500" role="img" aria-label="熱狗製作流程圖：開始，準備材料，判斷材料是否齊全；若否則補齊材料後再加熱熱狗，若是則直接加熱熱狗，接著組合麵包與配料，輸出完成的熱狗，最後結束。"><defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="currentColor" /></marker></defs><g class="flow-lines" marker-end="url(#arrowhead)"><path d="M280 46V74"/><path d="M280 116V142"/><path d="M280 226V252"/><path d="M196 184H100V252"/><path d="M180 275H200"/><path d="M280 298V324"/><path d="M280 370V394"/><path d="M280 436V454"/></g><rect class="flow-terminal" x="220" y="8" width="120" height="38" rx="19"/><rect class="flow-process" x="190" y="74" width="180" height="42" rx="3"/><path class="flow-decision" d="M280 142L364 184L280 226L196 184Z"/><rect class="flow-process" x="20" y="252" width="160" height="46" rx="3"/><rect class="flow-process" x="200" y="252" width="160" height="46" rx="3"/><rect class="flow-process" x="190" y="324" width="180" height="46" rx="3"/><path class="flow-io" d="M205 394H365L351 436H191Z"/><rect class="flow-terminal" x="220" y="454" width="120" height="38" rx="19"/><g class="flow-text"><text x="280" y="33">開始</text><text x="280" y="101">準備材料</text><text x="280" y="190">材料齊全？</text><text x="100" y="280">補齊材料</text><text x="280" y="280">加熱熱狗</text><text x="280" y="352">組合麵包與配料</text><text x="280" y="421">輸出完成熱狗</text><text x="280" y="479">結束</text><text x="154" y="174">否</text><text x="304" y="242">是</text></g></svg></figure>`;
}

function escapeLine(line: string) {
  return line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function lessonPage(lesson: Lesson) {
  const chapter = chapters.find((item) => item.lessons.includes(lesson))!;
  const index = lessons.indexOf(lesson);
  return `<article class="lesson-page ${chapter.theme}">
    <a class="back-link" href="#/">← 回到課程總覽</a>
    <div class="lesson-header"><p class="eyebrow">CHAPTER 0${chapter.id} ／ ${chapter.title}</p><div class="lesson-tag">課堂單元 ${lesson.id} <span>· ${lesson.time}</span></div><h1>${lesson.title}</h1><p>${lesson.summary}</p></div>
    <section class="objective-section"><h2><span>01</span> 本節目標</h2><ul class="objective-list">${lesson.objectives.map((objective) => `<li>${objective}</li>`).join('')}</ul></section>
    <section class="concept-section"><h2><span>02</span> 重點教學</h2><div class="concept-grid">${lesson.concepts.map((concept) => `<div><h3>${concept.title}</h3><p>${concept.text}</p></div>`).join('')}</div></section>
    <section class="demo-section"><h2><span>03</span> 示範／例子</h2>${lesson.id === '2-1' ? flowchart() : ''}<div class="example"><h3>${lesson.example.title}</h3><pre>${lesson.example.lines.map(escapeLine).join('\n')}</pre></div></section>
    <section class="activity-section"><p class="eyebrow">CLASSROOM TASK</p><h2><span>04</span> 課堂任務：${lesson.activity}</h2><ol>${lesson.steps.map((step) => `<li>${step}</li>`).join('')}</ol>${lesson.resource ? `<a class="resource-link" href="${lesson.resource.url}" target="_blank" rel="noopener noreferrer">${lesson.resource.label} ${arrow}<span class="sr-only">（在新分頁開啟）</span></a>` : ''}</section>
    <section class="completion-section"><h2><span>05</span> 完成條件</h2><p>${lesson.deliverable}</p><div class="checklist-heading"><h3><span class="section-number">06</span> 課堂檢核</h3><span id="checklist-count">${checkedCount(progress, lesson)} / ${lesson.checklist.length} 項</span></div><p class="checklist-hint">確認自己在這堂課已做到，再勾選；三項都完成即記錄本節完成。</p><div class="checklist">${lesson.checklist.map((item, i) => `<label><input type="checkbox" data-lesson="${lesson.id}" data-index="${i}" ${progress[lesson.id]?.[i] ? 'checked' : ''}><span>${item}</span></label>`).join('')}</div><p class="save-status" role="status">${storage ? '勾選後會自動儲存在此瀏覽器。' : '瀏覽器無法儲存，進度僅在本次開啟期間保留。'}</p></section>
    <nav class="lesson-pagination" aria-label="前後小節">${index > 0 ? `<a href="${lessonLink(lessons[index - 1])}"><small>← 上一節</small>${lessons[index - 1].title}</a>` : '<a href="#/"><small>← 學習地圖</small>回到課程總覽</a>'}${index < lessons.length - 1 ? `<a href="${lessonLink(lessons[index + 1])}"><small>下一節 →</small>${lessons[index + 1].title}</a>` : '<a href="#/"><small>完成總覽 →</small>查看我的進度</a>'}</nav>
  </article>`;
}

function notify(message: string) {
  document.querySelector('.toast')!.textContent = message;
}

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
    document.querySelector('.save-status')!.textContent = saved ? (isComplete(progress, lesson) ? '本節已完成！進度已儲存。' : '進度已儲存。') : '無法儲存至瀏覽器；本次進度仍保留，重新整理後可能遺失。';
    const marker = document.querySelector(`[data-nav-check="${lesson.id}"]`)!;
    marker.textContent = isComplete(progress, lesson) ? '✓' : '';
    marker.setAttribute('aria-label', isComplete(progress, lesson) ? '已完成' : '未完成');
  }));

  const dialog = document.querySelector<HTMLDialogElement>('#reset-dialog')!;
  document.querySelector('#reset-progress')?.addEventListener('click', () => dialog.showModal());
  document.querySelector('#cancel-reset')!.addEventListener('click', () => dialog.close());
  document.querySelector('#confirm-reset')!.addEventListener('click', () => {
    if (storage && !resetProgress(storage)) {
      dialog.close();
      notify('瀏覽器未允許清除儲存資料，原有進度仍保留，請稍後再試。');
      return;
    }
    progress = {};
    dialog.close();
    render(false);
    notify('學習進度已重設。');
    document.querySelector<HTMLButtonElement>('#reset-progress')?.focus();
  });
}

function render(focus = false) {
  const route = !location.hash || location.hash === '#main' ? '#/' : location.hash;
  const lesson = lessons.find((item) => lessonLink(item) === route);
  const chapter = chapters.find((item) => route === `#/chapter/${item.id}`);
  const valid = route === '#/' || lesson || chapter;
  app.innerHTML = shell(lesson ? lessonPage(lesson) : valid ? home() : '<section class="not-found"><p class="eyebrow">404 / LOST IN EXPLORATION</p><h1>這個課堂單元還不存在</h1><p>回到課程總覽，選擇一個單元繼續。</p><a class="primary" href="#/">回到課程總覽 →</a></section>');
  document.title = `${lesson ? lesson.title : '學習地圖'}｜資訊探險室・七上資訊科技`;
  bindEvents();
  if (focus) {
    document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  if (chapter) document.querySelector(`#chapter-${chapter.id}`)?.scrollIntoView({ behavior: 'instant' });
}

window.addEventListener('hashchange', () => render(true));
render();