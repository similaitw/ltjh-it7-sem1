const block = (className: string, label: string) => `<span class="scratch-block ${className}">${label}</span>`;

function scratchBasicsVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-2-2">
    <div class="guided-visual-heading"><p class="eyebrow">看圖照著做</p><h3 id="visual-2-2">Scratch：從介面到第一個走路動畫</h3><p>先辨認畫面，再照積木由上往下組合。每完成一小段就按綠旗測試。</p></div>
    <div class="scratch-map">
      <div class="scratch-panel palette-panel"><strong>① 積木類別</strong><span>事件</span><span>動作</span><span>外觀</span><span>控制</span><small>先找「當綠旗被點擊」當起點。</small></div>
      <div class="scratch-panel script-panel"><strong>② 腳本區</strong>
        <div class="block-stack">
          ${block('event', '當綠旗被點擊')}
          ${block('control', '重複 15 次')}
          <div class="nested-blocks">${block('motion', '移動 30 點')}${block('looks', '下一個造型')}${block('control', '等待 0.3 秒')}</div>
        </div>
        <small>積木位置會影響結果；一次只改一個地方再測。</small>
      </div>
      <div class="scratch-panel stage-panel"><strong>③ 舞臺區</strong><div class="mini-stage"><span class="stage-start">起點</span><span class="stage-character">角色</span><span class="stage-path">→ → →</span><span class="stage-end">終點</span></div><small>角色移動、造型切換與等待會直接反映在舞臺。</small></div>
    </div>
    <div class="broadcast-strip"><span>角色 A 說話</span><b>→ 廣播訊息 →</b><span>角色 B 收到訊息</span><b>→</b><span>角色 B 說話</span></div>
    <div class="debug-check"><strong>沒有動？依序檢查</strong><span>1. 有綠旗事件嗎？</span><span>2. 現在選到正確角色嗎？</span><span>3. 重複積木有包住三個動作嗎？</span><span>4. 等待時間是否太短？</span></div>
  </section>`;
}

function scratchCalcVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-2-3">
    <div class="guided-visual-heading"><p class="eyebrow">先分析，再拖積木</p><h3 id="visual-2-3">Scratch 計算：IPO → 變數 → 流程 → 測試</h3><p>教材反覆強調：先分析問題與流程圖，再把流程翻成 Scratch 程式。</p></div>
    <div class="ipo-grid">
      <div><span>I</span><strong>Input 輸入</strong><p>詢問 N，取得使用者輸入。</p></div>
      <div><span>P</span><strong>Process 處理</strong><p>設定變數初值、計算、判斷或重複。</p></div>
      <div><span>O</span><strong>Output 輸出</strong><p>說出答案或顯示變數結果。</p></div>
    </div>
    <div class="calc-example-grid">
      <div class="calc-card"><h4>範例 A｜1 × 2 × … × N</h4><div class="block-stack compact">
        ${block('variables', '乘積 設為 1')}
        ${block('variables', 'i 設為 1')}
        ${block('control', '重複直到 i > N')}
        <div class="nested-blocks">${block('variables', '乘積 設為 乘積 × i')}${block('variables', 'i 改變 1')}</div>
        ${block('looks', '說出 乘積')}
      </div><p class="why-note">為什麼乘積初值是 1？因為設成 0，後面再乘任何數都只會得到 0。</p></div>
      <div class="calc-card"><h4>範例 B｜成績及格判斷</h4><div class="decision-demo"><span>先算成績</span><b>→</b><span class="diamond-text">成績 ≥ 60？</span><b>→ 是：及格<br>→ 否：再努力</b></div><p class="why-note">這就是雙向選擇：同一個條件，走兩條不同路。</p></div>
    </div>
    <div class="test-table"><strong>至少測三組</strong><span>N = 1 → 1</span><span>N = 3 → 6</span><span>N = 5 → 120</span><span>答案不對時，先核對「初值、停止條件、每次更新」三件事。</span></div>
  </section>`;
}

function scratchDrawVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-2-4">
    <div class="guided-visual-heading"><p class="eyebrow">座標＋畫筆</p><h3 id="visual-2-4">Scratch 繪圖：先定位，再畫，再找重複規律</h3><p>Scratch 舞臺中心是 (0,0)。畫圖前先清除、提筆、定位、定方向，再落筆。</p></div>
    <div class="draw-visual-grid">
      <div class="coordinate-board" aria-label="Scratch 舞臺座標示意"><span class="axis-label y-plus">y+</span><span class="axis-label y-minus">y−</span><span class="axis-label x-plus">x+</span><span class="axis-label x-minus">x−</span><span class="origin-dot"></span><small>(0,0)</small><i class="sample-point"></i><b>(120,80)</b></div>
      <div class="draw-sequence"><strong>每次畫圖先做</strong><span>1 清除</span><span>2 提筆</span><span>3 定位</span><span>4 面朝方向</span><span>5 下筆</span></div>
    </div>
    <div class="shape-grid">
      <div><h4>正方形</h4><div class="block-stack compact">${block('control', '重複 4 次')}<div class="nested-blocks">${block('motion', '移動 80 點')}${block('motion', '右轉 90 度')}</div></div></div>
      <div><h4>擴散方形</h4><p>外加「長度」變數：每畫完一輪，把長度增加，再畫下一個更大的方形。</p><div class="formula-chip">移動 長度 → 長度增加 10</div></div>
      <div><h4>旋轉三角形</h4><p>內層畫一個三角形；外層重複整個圖形並旋轉。</p><div class="formula-chip">內層 3 次 × 120° ｜ 外層 12 次 × 30°</div></div>
    </div>
  </section>`;
}

function projectPlanVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-3-1">
    <div class="guided-visual-heading"><p class="eyebrow">專題流程</p><h3 id="visual-3-1">園遊會不是先做檔案，而是先把問題想清楚</h3></div>
    <div class="project-roadmap"><span>1 討論與規劃</span><b>→</b><span>2 界定問題</span><b>→</b><span>3 資料蒐集</span><b>→</b><span>4 計畫與執行</span><b>→</b><span>5 成果、測試與改善</span></div>
    <p class="roadmap-note">每一步都要留下產出：規劃卡 → 來源紀錄 → 計畫書／記帳表 → 成果簡報 → 改善紀錄。</p>
  </section>`;
}

function googleToolsVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-3-2">
    <div class="guided-visual-heading"><p class="eyebrow">工具選擇地圖</p><h3 id="visual-3-2">Google 工具家族：先問「我要做什麼？」</h3></div>
    <div class="google-pipeline">
      <div><span>搜尋</span><strong>找資料</strong><small>作法、材料、價格、規定</small></div><b>→</b>
      <div><span>文件</span><strong>寫計畫</strong><small>整理資料、分工、共同編輯</small></div><b>→</b>
      <div><span>試算表</span><strong>算數據</strong><small>成本、收入、淨利、圖表</small></div><b>→</b>
      <div><span>簡報</span><strong>說成果</strong><small>照片、圖表、反思與改善</small></div>
    </div>
    <div class="permission-note"><strong>分享前先看權限：</strong><span>檢視者＝只能看</span><span>留言者＝可提意見</span><span>編輯者＝可直接修改</span></div>
  </section>`;
}

function googlePlanVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-3-3">
    <div class="guided-visual-heading"><p class="eyebrow">搜尋 → 文件 → 試算表</p><h3 id="visual-3-3">園遊會攤位規劃：把「找到資料」變成「可以執行」</h3></div>
    <div class="search-cheatsheet">
      <div><code>乾冰汽水 製作</code><span>空格：同時包含多個概念</span></div>
      <div><code>熱狗麵糊 OR 熱狗作法</code><span>OR：找任一條件，教材提醒用大寫</span></div>
      <div><code>飲料 -酒精</code><span>減號：排除不要的結果</span></div>
      <div><code>環保杯 site:gov.tw</code><span>site:：限定網站或網域</span></div>
    </div>
    <div class="docs-sheets-grid">
      <div class="docs-mock"><strong>Google 文件｜計畫書</strong><span class="doc-title">園遊會攤位計畫</span><span>一、目標</span><span>二、材料與流程</span><span>三、分工</span><span>四、資料來源</span><small>建立標題層次，再插入圖片、表格或編號。</small></div>
      <div class="sheet-mock"><strong>Google 試算表｜記帳本</strong><div class="sheet-row head"><span>品項</span><span>單價</span><span>數量</span><span>小計</span></div><div class="sheet-row"><span>紙杯</span><span>2</span><span>50</span><span>=B2*C2</span></div><div class="sheet-row"><span>熱狗</span><span>15</span><span>30</span><span>=B3*C3</span></div><div class="sheet-row total"><span>總成本</span><span></span><span></span><span>=SUM(D2:D3)</span></div><small>改一個數量後，小計與總成本應自動更新。</small></div>
    </div>
  </section>`;
}

function slidesVisual() {
  return `<section class="guided-visual" aria-labelledby="visual-3-4">
    <div class="guided-visual-heading"><p class="eyebrow">成果簡報</p><h3 id="visual-3-4">把資料排成一個聽得懂的故事</h3><p>不是把計畫書全文貼上去；每頁只處理一個重點，圖表要搭配一句解讀。</p></div>
    <div class="slide-storyboard">
      <div><span>01</span><strong>問題</strong><small>我們要解決什麼？</small></div>
      <div><span>02</span><strong>規劃</strong><small>材料、流程、分工</small></div>
      <div><span>03</span><strong>數據</strong><small>成本、收入、圖表</small></div>
      <div><span>04</span><strong>成果</strong><small>照片或模擬結果</small></div>
      <div><span>05</span><strong>改善</strong><small>回饋、修正、來源</small></div>
    </div>
    <div class="presentation-check"><span>後排看得到字嗎？</span><span>圖表有標題與單位嗎？</span><span>每位組員都有負責內容嗎？</span><span>試講後有依回饋修改一處嗎？</span></div>
  </section>`;
}

const visuals: Record<string, () => string> = {
  '2-2': scratchBasicsVisual,
  '2-3': scratchCalcVisual,
  '2-4': scratchDrawVisual,
  '3-1': projectPlanVisual,
  '3-2': googleToolsVisual,
  '3-3': googlePlanVisual,
  '3-4': slidesVisual,
};

export const visualLessonIds = Object.keys(visuals);

export function lessonVisualHtml(lessonId: string) {
  return visuals[lessonId]?.() ?? '';
}
