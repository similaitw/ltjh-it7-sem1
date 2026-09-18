# 資訊探險室｜七上資訊科技

繁體中文、可直接瀏覽的七年級上學期資訊科技教學與自學網站。使用 Vite、TypeScript 與 CSS，無後端、無需登入本站。

## 正式網站

- Production：https://ltjh-it7-sem1.vercel.app
- 完整自學講義：https://ltjh-it7-sem1.vercel.app/#/handbook
- App Inventor 延伸：https://ltjh-it7-sem1.vercel.app/#/appendix/app-inventor
- 教用習作練習室：https://ltjh-it7-sem1.vercel.app/#/practice-lab
- 教師管理頁：https://ltjh-it7-sem1.vercel.app/#/teacher
- Vercel 專案：`ltjh-it7-sem1`
- GitHub：`similaitw/ltjh-it7-sem1`

網站採 hash 路由，可直接開啟指定單元；目前課堂 checklist、學生資料與小測驗紀錄都儲存在目前瀏覽器的 localStorage，不會跨裝置同步。

## 六冊 PDF 與完整自學講義

本次提供的 6 冊 PDF 已全部納入教材來源地圖，共 272 頁：

- `01-115國中資科1上備課-目次.pdf`：29 頁
- `02-115國中資科1上備課-L01.pdf`：38 頁
- `03-115國中資科1上備課-L02.pdf`：106 頁
- `04-115國中資科1上備課-L03.pdf`：48 頁
- `05-115國中資科1上備課-附錄.pdf`：19 頁
- `06-115國中資科1上備課-教用習作.pdf`：32 頁

首頁可開啟「完整自學講義」。每一個單元在原有「本節目標、重點教學、示範／例子」之後，增加 PDF-based 自學講義，包括：

1. 開始前先知道的重點
2. 依主題拆解的深入講解
3. 跟著做的明確步驟
4. 自己試試看的練習
5. 原 PDF 對照頁碼與內容說明

網站不以整頁掃描方式重貼 PDF，而是將章節知識點、例題類型、操作流程、補充資源、參考解答與習作方向重新整理成適合七年級學生自學的內容；每節保留 PDF 頁碼，方便教師核對。

三章 10 個正式單元都已加入網站原生圖解：第一章以生活科技、資訊議題與查證流程整理；第二章以流程圖符號、Scratch 積木、IPO、座標與畫筆呈現；第三章以專題流程、Google 工具選擇、搜尋語法、文件／試算表與簡報故事線呈現。附錄與教用習作也各有獨立自學頁。

## 課程架構

- 第一章「資訊科技導論」：資訊科技與人類生活；資訊科技及其相關議題。自學講義涵蓋食衣住行育樂、AI、AR、VR、IoT、輔助駕駛、線上學習、資安、著作權、資訊倫理、法律、媒體素養與資訊產業。
- 第二章「基礎程式設計」：演算法與流程圖、Scratch 基礎、Scratch 計算、Scratch 繪圖。納入 IPO、變數、循序／選擇／重複、累加／連乘、座標、畫筆、變數圖形、巢狀結構，以及 App Inventor 附錄延伸。
- 第三章「資料處理應用專題」：專題規劃、Google 工具家族、園遊會攤位規劃、成果報告。納入搜尋技巧、Google 文件、Google 試算表公式／函式／圖表、Google 簡報與教用習作中的資料處理題型。

所有課堂任務都設計為課堂內完成，不安排回家作業或課後繳交。

## 單元小測驗與通過紀錄

10 個正式單元各有 10 題教材對齊題庫，共 100 題。每次測驗隨機抽 5 題，答對 4 題（80%）即通過；可重複挑戰，網站會記錄每次分數、最高分、挑戰次數、通過與否，以及需要回頭複習的概念。

原本的三項 checklist 現在只代表「課堂任務完成」，不再等同「理解通過」。理解狀態以本節小測驗另外記錄。學生第一次測驗需填班級、座號、姓名，目前這些資料與測驗紀錄都只存在該瀏覽器的 localStorage。

## 教師管理頁

`/#/teacher` 已有第一版教師管理功能。學生可把自己的測驗紀錄匯出成 JSON；教師頁可一次匯入多位學生的紀錄，依班級顯示 10 個單元的通過矩陣、最高分、挑戰次數與各單元通過人數。

這一版是「本機匯入 MVP」：姓名與成績不會自動上傳到公開服務。下一階段 M3.2 會加入班級碼、雲端同步與教師驗證，讓教師不必人工收集 JSON。

## 本機啟動

需要 Node.js 22.12 以上（建議 Node.js 24）與 npm。

```sh
npm ci
npm run dev
```

開啟終端顯示的本機網址（預設 `http://localhost:5173`）。

```sh
npm test             # 課程、PDF 自學講義、進度保存與 DOM 互動測試
npm run typecheck    # TypeScript 靜態檢查
npm run lint         # ESLint
npm run build        # 產生 dist/ 正式網站
npm run preview      # 本機預覽 production build
```

## 學習進度

三項課堂 checklist 只記錄「課堂任務完成」；小測驗另外記錄「理解通過」。課堂進度使用 localStorage 鍵 `ltjh-it7-sem1:progress:v1`，測驗紀錄使用 `ltjh-it7-sem1:quiz-results:v1`，學生班級／座號／姓名使用 `ltjh-it7-sem1:student-profile:v1`。這些資料目前只保存在同一瀏覽器、同一網站來源。

本站不收集帳號、作品或個人資料。Scratch 與 Google 工具連結會開啟新分頁；Google 協作活動需使用老師安排的帳號與權限。

## 部署到 Vercel

目前 production 已綁定 `similaitw/ltjh-it7-sem1`，Framework 為 **Vite**、Node.js 為 **24.x**，不需要環境變數。

若重新建立部署：Framework Preset 使用 Vite，Root Directory 為儲存庫根目錄，Install Command 為 `npm ci`，Build Command 為 `npm run build`，Output Directory 為 `dist`。

常用路由：

- 首頁：`/#/`
- 完整講義：`/#/handbook`
- App Inventor 附錄：`/#/appendix/app-inventor`
- 教用習作練習室：`/#/practice-lab`
- 教師管理：`/#/teacher`
- 單元：`/#/lesson/2-1`

## 維護流程

本專案採 **ChatGPT-first**：優先由 ChatGPT 直接讀取 GitHub、review、修改程式、補測試與驗收；只有遇到需要本機環境或 ChatGPT 無法直接完成的工作，才交由 Codex / Chat2Code Runner。

- `src/content.ts`：三章十節課程核心內容與課堂活動
- `src/selfStudy.ts`：六冊 PDF 轉寫的完整自學講義、步驟、練習與來源頁碼
- `src/handbookEnhancer.ts`：完整講義入口、來源地圖、延伸頁路由與單元自學講義整合
- `src/lessonVisuals.ts`：10 個單元的網站原生圖解
- `src/supplementPages.ts`：App Inventor 附錄與教用習作實作練習頁
- `src/handbook.css`：自學講義版面與手機響應式樣式
- `src/main.ts`：首頁、課程頁、流程圖、導覽與互動
- `src/progress.ts`：課堂 checklist 進度驗證、保存與重設
- `src/quizData.ts`：10 單元共 100 題教材對齊題庫與隨機抽題規則
- `src/quizProgress.ts`：學生資料、測驗嘗試、最高分、通過狀態與匯出／匯入資料模型
- `src/quizEnhancer.ts`：單元小測驗、學生紀錄匯出與教師管理頁
- `src/quiz.css`：小測驗與教師矩陣響應式樣式
- `src/style.css`：主站視覺樣式與響應式版面
- `tests/selfStudy.test.ts`：六冊 272 頁來源與十單元自學講義完整性測試
- `tests/lessonVisuals.test.ts`：10 個單元原生圖解與關鍵內容測試
- `tests/supplementPages.test.ts`：附錄與教用習作自學頁測試
- `tests/progress.test.ts`：內容與課堂 checklist 進度單元測試
- `tests/quiz.test.ts`：100 題題庫、抽題、通過門檻與測驗紀錄測試
- `tests/quizNavigation.test.ts`：10 單元小測驗與教師管理頁 DOM 測試
- `tests/navigation.test.ts`：十節課程導覽、勾選、重設、例外與可及性互動測試

建議實機驗收：以 375px 手機寬度與教室桌機／投影畫面逐節查看；勾選後重新整理，確認進度保留；測試重設取消與確認，以及鍵盤 Tab 操作和瀏覽器上一頁。
