import './quiz.css';
import { lessons } from './content';
import { PASSING_SCORE, QUIZ_LENGTH, pickQuiz, quizBank, type QuizQuestion } from './quizData';
import {
  addAttempt,
  clearTeacherImports,
  createBundle,
  isStudentRecordBundle,
  passedLessonCount,
  quizSummary,
  readProfile,
  readQuizState,
  readTeacherImports,
  saveProfile,
  saveTeacherImports,
  type StudentProfile,
  type StudentRecordBundle,
} from './quizProgress';

const activeQuiz: Record<string, QuizQuestion[]> = {};

function storageOrNull() {
  try { return window.localStorage; } catch { return null; }
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function studentProfileForm(profile: StudentProfile | null) {
  return `<form class="student-profile-form" id="student-profile-form">
    <div><label>班級<input name="className" maxlength="12" placeholder="例如 705" value="${escapeHtml(profile?.className ?? '')}" required></label></div>
    <div><label>座號<input name="seat" maxlength="4" inputmode="numeric" placeholder="例如 12" value="${escapeHtml(profile?.seat ?? '')}" required></label></div>
    <div><label>姓名<input name="name" maxlength="20" placeholder="學生姓名" value="${escapeHtml(profile?.name ?? '')}" required></label></div>
    <button type="submit">儲存學生資料</button>
  </form>`;
}

function summaryHtml(lessonId: string) {
  const storage = storageOrNull();
  if (!storage) return '<p class="quiz-storage-note">目前瀏覽器無法儲存測驗紀錄。</p>';
  const summary = quizSummary(readQuizState(storage), lessonId);
  if (!summary.attempts) return '<span class="quiz-status not-started">尚未測驗</span>';
  return `<div class="quiz-summary-row">
    <span class="quiz-status ${summary.passed ? 'passed' : 'failed'}">${summary.passed ? '✓ 已通過' : '尚未通過'}</span>
    <span>最高 ${summary.bestScore}/${QUIZ_LENGTH}</span>
    <span>挑戰 ${summary.attempts} 次</span>
  </div>`;
}

function quizIntro(lessonId: string) {
  const storage = storageOrNull();
  const profile = storage ? readProfile(storage) : null;
  return `<section class="quiz-section" data-quiz-lesson="${lessonId}" aria-labelledby="quiz-title-${lessonId}">
    <div class="quiz-heading">
      <div><p class="eyebrow">SELF CHECK QUIZ</p><h2 id="quiz-title-${lessonId}"><span>07</span> 本節小測驗</h2><p>每次從 10 題題庫隨機抽 5 題，答對 4 題（80%）即通過。可重測，系統會保留最高分與挑戰次數。</p></div>
      ${summaryHtml(lessonId)}
    </div>
    ${profile ? `<div class="student-chip"><span>${escapeHtml(profile.className)} 班</span><span>${escapeHtml(profile.seat)} 號</span><strong>${escapeHtml(profile.name)}</strong><button type="button" data-edit-profile>修改</button></div>` : `<div class="profile-needed"><h3>第一次測驗前先留下班級、座號、姓名</h3><p>資料目前只存在這台瀏覽器，用來把測驗紀錄和學生對上。</p>${studentProfileForm(null)}</div>`}
    ${profile ? `<div class="quiz-actions"><button class="quiz-primary" type="button" data-start-quiz>開始本節小測驗</button><button class="quiz-secondary" type="button" data-export-record>匯出我的測驗紀錄</button></div>` : ''}
  </section>`;
}

function questionHtml(question: QuizQuestion, index: number) {
  return `<fieldset class="quiz-question">
    <legend><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(question.prompt)}</legend>
    <div class="quiz-options">${question.options.map((option, optionIndex) => `<label><input type="radio" name="quiz-q-${index}" value="${optionIndex}"><span>${escapeHtml(option)}</span></label>`).join('')}</div>
  </fieldset>`;
}

function quizFormHtml(lessonId: string, questions: QuizQuestion[]) {
  return `<section class="quiz-section quiz-active" data-quiz-lesson="${lessonId}" aria-labelledby="quiz-title-${lessonId}">
    <div class="quiz-heading"><div><p class="eyebrow">SELF CHECK QUIZ</p><h2 id="quiz-title-${lessonId}"><span>07</span> 本節小測驗</h2><p>請獨立作答。送出後會告訴你需要複習的概念，不直接顯示整份答案。</p></div><span class="quiz-counter">5 題 · 80% 通過</span></div>
    <form id="lesson-quiz-form">${questions.map(questionHtml).join('')}<div class="quiz-submit-row"><button class="quiz-primary" type="submit">送出答案</button><button class="quiz-secondary" type="button" data-cancel-quiz>取消</button><span class="quiz-message" role="status"></span></div></form>
  </section>`;
}

function quizResultHtml(lessonId: string, score: number, concepts: string[], passed: boolean) {
  const title = passed ? '本節小測驗通過！' : '這次還沒通過';
  const note = passed
    ? '理解檢核已通過。你可以繼續下一節，也可以再挑戰提高最高分。'
    : '先回到講義複習下面的概念，再重新挑戰。';
  return `<section class="quiz-section quiz-result" data-quiz-lesson="${lessonId}" aria-labelledby="quiz-title-${lessonId}">
    <div class="quiz-result-score ${passed ? 'passed' : 'failed'}"><strong>${score}<small>/ ${QUIZ_LENGTH}</small></strong><span>${passed ? 'PASS' : 'REVIEW'}</span></div>
    <div class="quiz-result-copy"><p class="eyebrow">SELF CHECK RESULT</p><h2 id="quiz-title-${lessonId}">${title}</h2><p>${note}</p>
      ${concepts.length ? `<div class="review-concepts"><strong>建議複習：</strong>${concepts.map((concept) => `<span>${escapeHtml(concept)}</span>`).join('')}</div>` : ''}
      <div class="quiz-actions"><button class="quiz-primary" type="button" data-start-quiz>再測一次</button><button class="quiz-secondary" type="button" data-export-record>匯出我的測驗紀錄</button></div>
    </div>
  </section>`;
}

function replaceQuizSection(html: string) {
  const section = document.querySelector<HTMLElement>('.quiz-section');
  if (!section) return;
  section.outerHTML = html;
  bindQuizEvents();
  document.querySelector<HTMLElement>('.quiz-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startQuiz(lessonId: string) {
  activeQuiz[lessonId] = pickQuiz(lessonId);
  replaceQuizSection(quizFormHtml(lessonId, activeQuiz[lessonId]));
}

function submitQuiz(form: HTMLFormElement, lessonId: string) {
  const questions = activeQuiz[lessonId] ?? [];
  if (questions.length !== QUIZ_LENGTH) return;
  const answers = questions.map((_, index) => {
    const selected = form.querySelector<HTMLInputElement>(`input[name="quiz-q-${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });
  const message = form.querySelector<HTMLElement>('.quiz-message');
  if (answers.some((answer) => answer < 0)) {
    if (message) message.textContent = '還有題目未作答，請全部完成後再送出。';
    return;
  }
  const wrong = questions.filter((question, index) => question.answer !== answers[index]);
  const score = QUIZ_LENGTH - wrong.length;
  const passed = score >= PASSING_SCORE;
  const concepts = [...new Set(wrong.map((question) => question.concept))];
  const storage = storageOrNull();
  if (storage) {
    addAttempt(storage, {
      id: `${lessonId}-${Date.now()}`,
      lessonId,
      questionIds: questions.map((question) => question.id),
      answers,
      score,
      total: QUIZ_LENGTH,
      passed,
      conceptsToReview: concepts,
      completedAt: new Date().toISOString(),
    });
  }
  replaceQuizSection(quizResultHtml(lessonId, score, concepts, passed));
  injectQuizBadges();
}

function safeFileName(value: string) {
  return value.replace(/[^0-9A-Za-z\u4e00-\u9fff_-]+/g, '-').replace(/^-+|-+$/g, '') || 'student';
}

function exportStudentRecord() {
  const storage = storageOrNull();
  if (!storage) return;
  const profile = readProfile(storage);
  if (!profile) return;
  const bundle = createBundle(profile, readQuizState(storage));
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeFileName(profile.className)}-${safeFileName(profile.seat)}-${safeFileName(profile.name)}-quiz.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function bindQuizEvents() {
  const section = document.querySelector<HTMLElement>('.quiz-section');
  if (!section) return;
  const lessonId = section.dataset.quizLesson!;
  section.querySelector('[data-start-quiz]')?.addEventListener('click', () => startQuiz(lessonId));
  section.querySelector('[data-cancel-quiz]')?.addEventListener('click', () => replaceQuizSection(quizIntro(lessonId)));
  section.querySelector('[data-export-record]')?.addEventListener('click', exportStudentRecord);
  section.querySelector('[data-edit-profile]')?.addEventListener('click', () => {
    const storage = storageOrNull();
    const profile = storage ? readProfile(storage) : null;
    section.querySelector('.student-chip')!.outerHTML = `<div class="profile-needed compact"><h3>修改學生資料</h3>${studentProfileForm(profile)}</div>`;
    bindQuizEvents();
  });
  section.querySelector<HTMLFormElement>('#student-profile-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const storage = storageOrNull();
    if (!storage) return;
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const profile = {
      className: String(data.get('className') ?? ''),
      seat: String(data.get('seat') ?? ''),
      name: String(data.get('name') ?? ''),
    };
    if (!saveProfile(storage, profile)) return;
    replaceQuizSection(quizIntro(lessonId));
  });
  section.querySelector<HTMLFormElement>('#lesson-quiz-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuiz(event.currentTarget as HTMLFormElement, lessonId);
  });
}

function enhanceLessonQuiz() {
  const match = location.hash.match(/^#\/lesson\/(\d-\d)$/);
  if (!match || document.querySelector('.quiz-section')) return;
  const completion = document.querySelector('.lesson-page .completion-section');
  if (!completion) return;
  completion.insertAdjacentHTML('afterend', quizIntro(match[1]));
  bindQuizEvents();
}

function injectQuizBadges() {
  const storage = storageOrNull();
  if (!storage) return;
  const state = readQuizState(storage);
  for (const lesson of lessons) {
    const card = document.querySelector<HTMLAnchorElement>(`.lesson-card[href="#/lesson/${lesson.id}"]`);
    if (!card) continue;
    card.querySelector('.quiz-mini-badge')?.remove();
    const summary = quizSummary(state, lesson.id);
    const badge = document.createElement('span');
    badge.className = `quiz-mini-badge ${summary.passed ? 'passed' : summary.attempts ? 'failed' : 'not-started'}`;
    badge.textContent = summary.passed ? `測驗 ✓ ${summary.bestScore}/5` : summary.attempts ? `測驗 ${summary.bestScore}/5` : '測驗未開始';
    card.querySelector('.card-bottom')?.prepend(badge);
  }
  const panel = document.querySelector('.progress-panel > div:first-child > div');
  if (panel && !panel.querySelector('.quiz-home-summary')) {
    const span = document.createElement('p');
    span.className = 'quiz-home-summary';
    span.textContent = `小測驗通過：${passedLessonCount(state)} / 10 單元`;
    panel.append(span);
  }
}

function injectTeacherNav() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar || sidebar.querySelector('.teacher-nav')) return;
  const overview = sidebar.querySelector('.overview');
  if (!overview) return;
  const link = document.createElement('a');
  link.className = `teacher-nav${location.hash === '#/teacher' ? ' active' : ''}`;
  link.href = '#/teacher';
  link.textContent = '教師管理';
  const handbook = sidebar.querySelector('.handbook-nav');
  (handbook ?? overview).insertAdjacentElement('afterend', link);
}

function currentBundle(): StudentRecordBundle | null {
  const storage = storageOrNull();
  if (!storage) return null;
  const profile = readProfile(storage);
  if (!profile) return null;
  return createBundle(profile, readQuizState(storage));
}

function bestFor(bundle: StudentRecordBundle, lessonId: string) {
  const attempts = bundle.attempts.filter((attempt) => attempt.lessonId === lessonId);
  const best = attempts.reduce((score, attempt) => Math.max(score, attempt.score), 0);
  return { best, passed: attempts.some((attempt) => attempt.passed), attempts: attempts.length };
}

function classTables(bundles: StudentRecordBundle[]) {
  const groups = new Map<string, StudentRecordBundle[]>();
  for (const bundle of bundles) {
    const key = bundle.profile.className || '未分班';
    groups.set(key, [...(groups.get(key) ?? []), bundle]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'zh-Hant')).map(([className, records]) => {
    records.sort((a, b) => Number(a.profile.seat) - Number(b.profile.seat) || a.profile.name.localeCompare(b.profile.name, 'zh-Hant'));
    const passedCells = lessons.map((lesson) => {
      const passed = records.filter((record) => bestFor(record, lesson.id).passed).length;
      return `<span><strong>${lesson.id}</strong> ${passed}/${records.length}</span>`;
    }).join('');
    const rows = records.map((record) => `<tr><th scope="row"><span>${escapeHtml(record.profile.seat)} 號</span>${escapeHtml(record.profile.name)}</th>${lessons.map((lesson) => {
      const result = bestFor(record, lesson.id);
      const cls = result.passed ? 'passed' : result.attempts ? 'failed' : 'empty';
      return `<td class="${cls}" title="挑戰 ${result.attempts} 次">${result.attempts ? `${result.passed ? '✓ ' : ''}${result.best}/5` : '—'}</td>`;
    }).join('')}</tr>`).join('');
    return `<section class="teacher-class"><div class="teacher-class-heading"><div><p class="eyebrow">CLASS</p><h2>${escapeHtml(className)} 班</h2></div><span>${records.length} 人</span></div><div class="class-pass-strip">${passedCells}</div><div class="teacher-table-wrap"><table><thead><tr><th>學生</th>${lessons.map((lesson) => `<th title="${escapeHtml(lesson.title)}">${lesson.id}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }).join('');
}

function teacherHtml() {
  const storage = storageOrNull();
  const imported = storage ? readTeacherImports(storage) : [];
  const local = currentBundle();
  const map = new Map<string, StudentRecordBundle>();
  for (const bundle of [...imported, ...(local ? [local] : [])]) {
    const key = [bundle.profile.className, bundle.profile.seat, bundle.profile.name].join('|');
    const current = map.get(key);
    if (!current || current.exportedAt < bundle.exportedAt) map.set(key, bundle);
  }
  const records = [...map.values()];
  return `<div class="teacher-page"><a class="back-link" href="#/">← 回到課程總覽</a>
    <section class="teacher-hero"><div><p class="eyebrow">TEACHER DASHBOARD · LOCAL MVP</p><h1>教師管理頁</h1><p>查看各班 10 個單元的小測驗通過狀況。這一版先採「學生匯出 JSON → 教師匯入」方式，不把姓名與成績上傳到公開服務；下一階段再接雲端班級資料庫。</p></div><div class="teacher-stat"><strong>${records.length}</strong><span>已載入學生</span></div></section>
    <section class="teacher-import"><div><h2>匯入學生測驗紀錄</h2><p>可一次選取多個學生匯出的 <code>*-quiz.json</code>。同一位學生重複匯入時會保留較新的紀錄。</p></div><div class="teacher-actions"><label class="quiz-primary file-button">選擇紀錄檔<input id="teacher-import-files" type="file" accept="application/json,.json" multiple></label><button class="quiz-secondary" id="teacher-clear-imports" type="button">清除已匯入資料</button></div><p class="teacher-import-message" role="status"></p></section>
    <section class="teacher-legend"><span><i class="passed"></i>已通過</span><span><i class="failed"></i>做過但未通過</span><span><i class="empty"></i>尚未測驗</span><small>儲存格顯示最高分；滑鼠停留可看挑戰次數。</small></section>
    ${records.length ? classTables(records) : '<section class="teacher-empty"><h2>目前還沒有學生紀錄</h2><p>先讓學生在任一單元完成小測驗，按「匯出我的測驗紀錄」，再回到這裡一次匯入。</p></section>'}
  </div>`;
}

async function importTeacherFiles(files: FileList) {
  const storage = storageOrNull();
  if (!storage) return { ok: 0, bad: files.length };
  const bundles = readTeacherImports(storage);
  let ok = 0;
  let bad = 0;
  for (const file of Array.from(files)) {
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!isStudentRecordBundle(value)) { bad += 1; continue; }
      bundles.push(value);
      ok += 1;
    } catch {
      bad += 1;
    }
  }
  saveTeacherImports(storage, bundles);
  return { ok, bad };
}

function bindTeacherEvents() {
  const input = document.querySelector<HTMLInputElement>('#teacher-import-files');
  const message = document.querySelector<HTMLElement>('.teacher-import-message');
  input?.addEventListener('change', async () => {
    if (!input.files?.length) return;
    const result = await importTeacherFiles(input.files);
    if (message) message.textContent = `已匯入 ${result.ok} 份${result.bad ? `，${result.bad} 份格式不符` : ''}。`;
    renderTeacherRoute();
  });
  document.querySelector('#teacher-clear-imports')?.addEventListener('click', () => {
    const storage = storageOrNull();
    if (storage) clearTeacherImports(storage);
    renderTeacherRoute();
  });
}

function renderTeacherRoute() {
  if (location.hash !== '#/teacher') return false;
  const main = document.querySelector<HTMLElement>('#main');
  if (!main) return false;
  main.innerHTML = teacherHtml();
  document.title = '教師管理｜資訊探險室・七上資訊科技';
  bindTeacherEvents();
  return true;
}

function enhance() {
  injectTeacherNav();
  if (renderTeacherRoute()) return;
  enhanceLessonQuiz();
  injectQuizBadges();
}

window.addEventListener('hashchange', () => queueMicrotask(enhance));
queueMicrotask(enhance);

export { quizBank };
