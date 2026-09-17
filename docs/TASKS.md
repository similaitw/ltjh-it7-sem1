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
- [x] Vercel 最近一小時無 runtime error cluster
- [x] README 更新正式網址、正確課綱與 ChatGPT-first 維護流程

## Current Task

### M2.2 — 實機視覺 smoke test
程式層的 responsive CSS、導覽與互動測試均已通過；以下兩項屬於真實瀏覽器畫面驗收，需以手機或桌機實際打開 production 確認。

### Acceptance
- [ ] 375px 手機版首頁與課程頁無水平捲動、文字不被裁切
- [ ] 桌機／投影版側欄、章節切換與流程圖顯示正常
- [ ] production 實際勾選一節 → 重新整理仍保留 → 重設後歸零

## Next

### M3 — 教師課堂操作模式
由 ChatGPT-first 優先直接開發；只有需要本機環境或 ChatGPT 無法完成時才交由 Codex / Chat2Code Runner。

規劃內容：
- 投影／授課模式：放大單節課重點、隱藏不必要導覽
- 單節課流程提示：導入、講解、示範、學生實作、檢核
- 教師快速切換上一節／下一節與返回章節
- 全班進度檢核以「教師現場確認」為主，不建立學生帳號、不要求課後繳交
- 維持學生端 localStorage，不蒐集個資、不新增後端登入需求