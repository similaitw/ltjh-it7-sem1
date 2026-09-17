# 資訊探險室｜七上資訊科技

繁體中文、可直接瀏覽的七年級上學期資訊科技教學網站。使用 Vite、TypeScript 與 CSS，無後端、無需登入本站。

## 本機啟動

需要 Node.js 22.12 以上（建議 Node.js 24）與 npm。

```sh
npm ci
npm run dev
```

開啟終端顯示的本機網址（預設 `http://localhost:5173`）。

```sh
npm test             # 課程完整性、進度保存與例外處理
npm run typecheck    # TypeScript 靜態檢查
npm run lint         # ESLint
npm run build        # 產生 dist/ 正式網站
npm run preview      # 在本機預覽正式建置
```

## 課程與使用方式

- 第一章：電腦的合作任務、資料與數位足跡。
- 第二章：流程圖、循序與座標、條件選擇、重複與畫筆。
- 第三章：以園遊會為主題串起 Google 搜尋、文件、試算表、簡報。

首頁可進入全部 10 節；桌面側欄可切換小節，手機可使用課程總覽及上一節／下一節。每節都有原創摘要、觀念、課堂活動、完成條件與三項自評清單。活動設計為每節約 45 分鐘，實際節奏由教師調整。Scratch 與 Google 工具連結會開啟新分頁；Google 協作活動需使用老師安排的帳號與權限。本站不收集帳號、作品或個人資料。

所有項目勾選後該節才計為完成。進度使用 localStorage，鍵為 `ltjh-it7-sem1:progress:v1`，只保存在同一瀏覽器、同一網站來源，不會跨裝置同步。首頁「重設進度」需在對話框確認，僅清除本站紀錄。若瀏覽器禁止儲存或空間不足，畫面會提示，仍可在本次使用期間勾選。字型由 Google Fonts 載入；無法連線時會使用本機備援字型。

## 部署到 Vercel

1. 由專案管理者將儲存庫連接至 Vercel，選擇 **Add New → Project** 並匯入 `similaitw/ltjh-it7-sem1`。
2. Framework Preset 選 **Vite**，Root Directory 使用儲存庫根目錄。
3. Install Command 使用 `npm ci`，Build Command 使用 `npm run build`，Output Directory 使用 `dist`。Node.js 選 24.x；無需環境變數。
4. 部署後開啟網站，測試小節、勾選保存與重設。此站使用 hash 路由（例如 `/#/lesson/2-1`），重新整理或直接開啟小節不需要伺服器 rewrite 設定。

切換本機、預覽網址與正式網域時，各來源的進度彼此獨立。儲存庫建立、公開設定及 Git 操作由 Chat2Code Runner／專案管理者處理。

## 維護

- `src/content.ts`：三章十節課程內容與外部工具連結。
- `src/main.ts`：首頁、課程頁、流程圖、導覽與互動。
- `src/progress.ts`：進度驗證、保存、重設與完成判定。
- `src/style.css`：視覺樣式、響應式版面、鍵盤焦點與減少動態偏好。
- `tests/progress.test.ts`：內容與進度單元測試。
- `tests/navigation.test.ts`：十節課程導覽、勾選、重設、例外與可及性互動測試。

手動驗收：以 375px 寬度查看首頁與全部課程頁；逐節進入、勾選、重新整理，確認進度保留；測試重設取消與確認，以及鍵盤 Tab 操作和瀏覽器上一頁。
