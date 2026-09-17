# Tasks

## Completed

### M1 — Bootstrap + usable first version
- [x] 建立公開 repo `similaitw/ltjh-it7-sem1`
- [x] 建立三章、10 個小節與首頁導覽
- [x] 建立課堂活動、完成條件與 checklist
- [x] 建立 localStorage 進度保存與重設
- [x] 建立基本測試、typecheck、lint、production build 指令
- [x] 建立 PR #1

### M2 — 教材對齊、課堂結構與 CI 驗收
- [x] 第一章改為「資訊科技與人類生活」「資訊科技及其相關議題」，涵蓋食衣住行育樂、AI、資料保護、資訊安全、著作權、倫理、法律與媒體判讀
- [x] 2-1 對齊演算法、流程圖、機器語言、組合語言與高階語言
- [x] 2-2 對齊 Scratch 基礎操作與「角色走路」動畫
- [x] 2-3 對齊輸入／處理／輸出、變數、運算、循序／選擇／重複與連乘題型
- [x] 2-4 對齊舞臺座標、畫筆、正方形、擴散圖形與巢狀旋轉圖形
- [x] 第三章對齊專題規劃、Google 工具家族、搜尋／文件／試算表規劃與簡報成果報告
- [x] 每個單元固定呈現：本節目標、重點教學、示範／例子、課堂任務、完成條件、課堂檢核
- [x] 首頁明確標示所有任務均在課堂中完成，不安排課後繳交
- [x] 新增 GitHub Actions CI：test、typecheck、lint、build
- [x] CI 全部通過
- [x] 完成 ChatGPT-first PR review，修正阻擋問題並 squash merge 到 `main`

### M2.1 — Vercel production 技術驗收
- [x] 建立／綁定 Vercel 專案 `ltjh-it7-sem1`
- [x] Framework 確認為 Vite、Node.js 24.x
- [x] production deployment 為 READY
- [x] 正式網址 `https://ltjh-it7-sem1.vercel.app` 回應 HTTP 200
- [x] 正式 HTML 正確載入 Vite production JS/CSS bundle
- [x] hash 課程路由已由 DOM 測試涵蓋，無需伺服器 rewrite
- [x] checklist、localStorage 保存、重設與儲存失敗處理已有單元／DOM 測試
- [x] Vercel 無近期 runtime error cluster

### M2.2 — 流程圖視覺修正
- [x] 修正 2-1 熱狗流程圖箭頭與節點中心對齊
- [x] 「否 → 補齊材料 → 加熱熱狗」重新接回主流程
- [x] 「是」分支、輸出與結束箭頭重新定位

### M2.3 — 六冊 PDF 完整自學講義
- [x] 納入 `01-115國中資科1上備課-目次.pdf`（29 頁）
- [x] 納入 `02-115國中資科1上備課-L01.pdf`（38 頁）
- [x] 納入 `03-115國中資科1上備課-L02.pdf`（106 頁）
- [x] 納入 `04-115國中資科1上備課-L03.pdf`（48 頁）
- [x] 納入 `05-115國中資科1上備課-附錄.pdf`（19 頁）
- [x] 納入 `06-115國中資科1上備課-教用習作.pdf`（32 頁）
- [x] 建立 272 頁教材來源地圖，涵蓋章節規劃、課文、補充資源、參考解答、詞彙、附錄、習作與運算思維桌遊
- [x] 十個單元新增「完整自學講義」：開始前重點、深入講解、清楚操作步驟、練習與 PDF 對照頁碼
- [x] 第 1 章納入食衣住行育樂、AR／VR／IoT、AI、資安、著作權、倫理、法律、媒體素養與資訊產業
- [x] 第 2 章納入完整流程圖、Scratch 介面與動畫、IPO、變數、三大控制結構、累加／連乘、座標、畫筆、變數圖形與巢狀結構
- [x] 第 2 章附錄納入 App Inventor 介面、模擬器、重複加法／乘法與運算延伸
- [x] 第 3 章納入專題流程、Google 工具家族、搜尋技巧、文件、試算表公式／函式／圖表、簡報與成果改善
- [x] 教用習作納入題型與實作方向，包括 Scratch、資料處理、CSV／公共自行車、海霸尋寶等
- [x] 新增 `#/handbook` 完整講義入口與六冊 PDF 索引
- [x] 新增 `tests/selfStudy.test.ts`，驗證六冊 272 頁來源、10 個單元、步驟、練習與來源頁碼完整性
- [x] GitHub Actions：test、typecheck、lint、production build 全部通過
- [x] Vercel production 自動部署完成

## Current Task

### M2.4 — 自學講義畫面與內容細修
由 ChatGPT-first 直接處理，不交 Codex。

### Acceptance
- [ ] 教師實際閱讀每個單元，標記還需要增加的圖解或操作截圖
- [ ] 375px 手機版完整講義閱讀順暢，無水平捲動
- [ ] 投影模式下字級、段落與流程圖清楚
- [ ] 對教材中的重要圖示採網站原生圖解／流程圖重新繪製，避免只剩文字
- [ ] Scratch 與 Google 操作步驟依課堂實際介面持續補強

## Next

### M3 — 教師課堂操作模式
由 ChatGPT-first 優先直接開發；只有需要本機環境或 ChatGPT 無法完成時才交由 Codex / Chat2Code Runner。

規劃內容：
- 投影／授課模式：放大單節課重點、隱藏不必要導覽
- 單節課流程提示：導入、講解、示範、學生實作、檢核
- 教師快速切換上一節／下一節與返回章節
- 全班進度檢核以「教師現場確認」為主，不建立學生帳號、不要求課後繳交
- 維持學生端 localStorage，不蒐集個資、不新增後端登入需求
