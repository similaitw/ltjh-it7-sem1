# 資訊探險室｜七上資訊科技

繁體中文、可直接瀏覽的七年級上學期資訊科技教學網站。使用 Vite、TypeScript 與 CSS，無後端、無需登入本站。

## 正式網站

- Production：https://ltjh-it7-sem1.vercel.app
- Vercel 專案：`ltjh-it7-sem1`
- GitHub：`similaitw/ltjh-it7-sem1`

網站採 hash 路由，例如 `/#/lesson/2-1`，可直接開啟指定單元；學生進度只儲存在目前瀏覽器的 localStorage，不會跨裝置同步。

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

- 第一章「資訊科技導論」：資訊科技與人類生活、食衣住行育樂、AI 時代應用，以及資料保護、資訊安全、著作權、倫理、法律與媒體判讀。
- 第二章「基礎程式設計」：演算法與流程圖、程式語言概念、Scratch 基礎動畫、輸入／處理／輸出、變數、運算、選擇、重複、座標、畫筆與巢狀圖形。
- 第三章「資料處理應用專題」：專題規劃、Google 搜尋／文件／試算表／簡報，以及園遊會攤位規劃與成果報告。

首頁可進入全部 10 個單元；桌面側欄可切換小節，手機可使用課程總覽及上一節／下一節。每一節固定呈現「本節目標、重點教學、示範／例子、課堂任務、完成條件、課堂檢核」，所有任務都設計為課堂內完成，不安排回家作業或課後繳交。

Scratch 與 Google 工具連結會開啟新分頁；Google 協作活動需使用老師安排的帳號與權限。本站不收集帳號、作品或個人資料。

所有檢核項目勾選後該節才計為完成。進度使用 localStorage，鍵為 `ltjh-it7-sem1:progress:v1`，只保存在同一瀏覽器、同一網站來源。首頁「重設進度」需在對話框確認，僅清除本站紀錄。若瀏覽器禁止儲存或空間不足，畫面會提示，仍可在本次使用期間勾選。

## 部署到 Vercel

目前 production 已綁定 `similaitw/ltjh-it7-sem1`，Framework 為 **Vite**、Node.js 為 **24.x**，不需要環境變數。

若重新建立部署：

1. 在 Vercel 選 **Add New → Project**，匯入 `similaitw/ltjh-it7-sem1`。
2. Framework Preset 選 **Vite**，Root Directory 使用儲存庫根目錄。
3. Install Command 使用 `npm ci`，Build Command 使用 `npm run build`，Output Directory 使用 `dist`。
4. 部署後開啟首頁與 `/#/lesson/2-1` 等 hash 路由，測試勾選保存與重設。

切換本機、預覽網址與正式網域時，各來源的進度彼此獨立。

## 維護流程

本專案採 **ChatGPT-first**：優先由 ChatGPT 直接讀取 GitHub、review、修改程式、補測試與驗收；只有遇到需要本機環境或 ChatGPT 無法直接完成的工作，才交由 Codex / Chat2Code Runner。

- `src/content.ts`：三章十節課程內容與外部工具連結。
- `src/main.ts`：首頁、課程頁、流程圖、導覽與互動。
- `src/progress.ts`：進度驗證、保存、重設與完成判定。
- `src/style.css`：視覺樣式、響應式版面、鍵盤焦點與減少動態偏好。
- `tests/progress.test.ts`：內容與進度單元測試。
- `tests/navigation.test.ts`：十節課程導覽、勾選、重設、例外與可及性互動測試。

建議實機驗收：以 375px 手機寬度與教室桌機／投影畫面逐節查看；勾選後重新整理，確認進度保留；測試重設取消與確認，以及鍵盤 Tab 操作和瀏覽器上一頁。