export function appInventorAppendixHtml() {
  return `<div class="supplement-page">
    <a class="back-link" href="#/handbook">← 回到完整自學講義</a>
    <section class="supplement-hero"><p class="eyebrow">APPENDIX · PDF P.1–19</p><h1>App Inventor 延伸自學</h1><p>把第 2 章的重複、變數與運算概念搬到手機 App。這裡依附錄重新整理成「介面 → 測試 → 題型 → 除錯」的自學順序。</p></section>

    <section class="supplement-section"><h2>1｜先認識介面</h2>
      <div class="appinventor-ui">
        <div><strong>專案名稱</strong><span>以英文字母開頭，可使用英文字母、數字與底線。</span></div>
        <div><strong>組件面板</strong><span>從使用者介面、版面配置、多媒體、感測器等類別選元件。</span></div>
        <div><strong>工作面板</strong><span>拖曳元件安排 App 畫面，立即預覽配置。</span></div>
        <div><strong>組件清單／屬性</strong><span>重新命名元件，調整文字、大小、顏色、寬高等屬性。</span></div>
        <div><strong>素材</strong><span>管理 App 使用的圖片、聲音等媒體。</span></div>
        <div><strong>程式設計區</strong><span>切到積木頁後，用事件、變數、運算與重複積木完成程式。</span></div>
      </div>
    </section>

    <section class="supplement-section"><h2>2｜做完要測試</h2>
      <ol class="supplement-steps">
        <li>先完成畫面與積木。</li>
        <li>依裝置環境安裝／啟動模擬器，或直接使用手機測試。</li>
        <li>在 App Inventor 的「連線」功能選擇模擬器。</li>
        <li>如果連線不穩，重置連線後再重新連上。</li>
        <li>每改一段程式就重新測試，不要一次改很多地方。</li>
      </ol>
    </section>

    <section class="supplement-section"><h2>3｜附錄五組核心實作</h2>
      <div class="supplement-projects">
        <article><span>01</span><h3>重複加法</h3><p>輸入一個數字，重複累加固定次數。運算結果先設 0，每次迴圈做「結果 = 上次結果 + 輸入值」，最後顯示結果。</p><code>初值 0 → 重複 → 累加 → 顯示</code></article>
        <article><span>02</span><h3>重複乘法</h3><p>輸入運算數字與重複次數。附錄特別提醒：乘法不能把運算結果一直留在 0，要先給合適初值，再進入重複乘法。</p><code>設定初值 → 依次數重複乘法 → 顯示</code></article>
        <article><span>03</span><h3>四則運算</h3><p>用輸入盒收集數字，按下計算後輸出加、減、乘、除結果，練習版面配置、輸入／輸出與循序流程。</p><code>輸入 → 四種運算 → 四個結果</code></article>
        <article><span>04</span><h3>文字重複</h3><p>輸入文字後，做固定次數的文字串接；另一個按鈕可改成換行式重複。每次重新計算前先清空上一次的文字結果。</p><code>清空 → 重複 5 次 → 串接文字</code></article>
        <article><span>05</span><h3>1 ＋ 2 ＋ … ＋ N</h3><p>讓迴圈變數從 1 依序走到 N，每一回合把目前數字加進總和，最後顯示累加結果。</p><code>總和 0 → 數字 1…N → 累加 → 顯示</code></article>
      </div>
    </section>

    <section class="supplement-section"><h2>4｜自學除錯表</h2>
      <div class="debug-table">
        <div><strong>按鈕沒反應</strong><span>檢查程式起點是否接在正確的「按鈕被點選」事件。</span></div>
        <div><strong>第二次答案怪怪的</strong><span>確認每次按下按鈕時都有重新設定運算結果。</span></div>
        <div><strong>乘法永遠是 0</strong><span>檢查乘法用的運算結果初值。</span></div>
        <div><strong>重複次數不對</strong><span>核對迴圈起點、終點與每次增加的數值。</span></div>
        <div><strong>畫面排版亂</strong><span>先用垂直／水平配置整理元件，再調整個別屬性。</span></div>
      </div>
    </section>

    <aside class="source-callout">來源：<strong>05-115國中資科1上備課-附錄.pdf</strong>，P.1–19。網站重新整理操作順序與觀念，方便學生照步驟自學。</aside>
  </div>`;
}

export function practiceLabHtml() {
  return `<div class="supplement-page">
    <a class="back-link" href="#/handbook">← 回到完整自學講義</a>
    <section class="supplement-hero practice"><p class="eyebrow">WORKBOOK · PDF P.1–32</p><h1>教用習作・實作練習室</h1><p>把習作中的討論、Scratch、資料處理與運算思維活動整理成網站練習入口。以課堂練習與自我檢查為主，不另外安排課後繳交。</p></section>

    <section class="supplement-section"><h2>第 1 章｜生活與資訊議題</h2>
      <div class="practice-cards">
        <article><strong>智慧住宅想像</strong><p>挑一個目前沒有連網的家中物品，說明連網後會蒐集什麼資料、能做什麼、要注意什麼風險。</p></article>
        <article><strong>自行車輔助裝置</strong><p>設計一項讓騎乘更安全的輔助功能，指出要使用哪些感測或位置資料。</p></article>
        <article><strong>社群媒體辨識</strong><p>舉出不同類型社群媒體，整理主要功能，再討論哪些資料不適合公開。</p></article>
      </div>
    </section>

    <section class="supplement-section"><h2>第 2 章｜Scratch 與運算思維</h2>
      <div class="practice-cards">
        <article><strong>勇者與惡龍動畫</strong><p>先選背景與兩個角色；惡龍說話後廣播，騎士收到訊息再回應。按綠旗逐段測試對話順序。</p></article>
        <article><strong>流程圖與繪圖題</strong><p>把日常步驟畫成流程圖，再練習正方形、星形、擴大圖形等 Scratch 畫筆題型。</p></article>
        <article><strong>海霸尋寶桌遊</strong><p>把方向卡、跳島卡與迴圈卡視為程式指令；先排好完整指令，再一次執行，觀察小船是否能避開障礙到達寶藏。</p></article>
      </div>
      <div class="treasure-rule"><span>開始</span><b>→</b><span>依序執行卡牌</span><b>→</b><span>方向／跳島</span><b>→</b><span>迴圈重複部分指令</span><b>→</b><span>抵達寶藏</span></div>
    </section>

    <section class="supplement-section"><h2>第 3 章｜公共自行車 CSV 資料專題</h2>
      <ol class="supplement-steps numbered">
        <li>找到指定公共自行車開放資料頁面並下載 CSV。</li>
        <li>建立 Google 試算表，使用「檔案 → 開啟／匯入」上傳 CSV。</li>
        <li>確認欄位、列與數值是否正確，再挑選要分析的區域。</li>
        <li>依停車格數量排序，找出前幾名站點。</li>
        <li>選取需要的資料製作柱狀圖，標上清楚標題與數值單位。</li>
        <li>用一句話說明圖表看出了什麼，不只把圖表貼上去。</li>
        <li>小組分享結果與操作心得。</li>
      </ol>
      <div class="csv-flow"><span>CSV 檔</span><b>→</b><span>Google 試算表</span><b>→</b><span>整理／排序</span><b>→</b><span>柱狀圖</span><b>→</b><span>解讀與分享</span></div>
    </section>

    <aside class="source-callout">來源：<strong>06-115國中資科1上備課-教用習作.pdf</strong>，P.1–32；其中公共自行車資料實作位於後段，海霸尋寶桌遊位於 P.29–32。</aside>
  </div>`;
}
