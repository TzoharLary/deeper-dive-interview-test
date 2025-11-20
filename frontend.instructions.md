---
description: "הוראות לקופיילוט — מיגרציה מ-Base44 (React+Vite+@base44/sdk) → Vanilla TypeScript + HTML + CSS"
applyTo: "public/**, src/**, data/**"
---

# Frontend Migration Instructions — Base44 (React) → Vanilla TypeScript

מטרה קצרה:
- כל קוד פרונטנד חדש או refactor בריפו הזה חייב להיות ב-Vanilla TypeScript + HTML + CSS. מקורות השראה (UI, זרימות, copy) יכולים להגיע מ־Base44 React/Vite/@base44/sdk, אך הפלט תמיד Vanilla TS (ללא React או frameworks).

תחום/גוון:
- אין להשתמש ב-React, JSX/TSX, hooks, או library-driven components.
- אין להוסיף תלות כמו `react`, `vue`, `angular`, `@base44/sdk` או ספריות UI כבדות.

עקרונות זהב (Golden Rules):
- Target first: כשהמקור הוא React — התייחס לקומפוננטה כ־SPEC בלבד (UI + interaction description). המימוש בריפו זה חייב להיות HTML סטטי + CSS + מודול TypeScript שמטפל בלוגיקה וב־DOM.
- Separation of concerns: הפרד UI (HTML + CSS), logic (TS modules), ו-data access (service layer שמתממשק לקבצי JSON מקומיים).
- No external SDKs: כל data מגיע מקבצי JSON מקומיים (תקיית `data/`) או משירותים פנימיים שתכתוב ב-TS.
- Explicit types: כתוב טיפוסים/Interfaces מפורשים (לדוגמה `Publisher`, `Page`, `Config`). הימנע מ־`any` אלא אם באמת אין ברירה.
- Small modules & functions: שמור על מודולים קטנים, חיבוריים וקריאים; שמות פונקציות ברורים (e.g., `renderPublisherList`, `fetchPublishersFromFile`).
- No magic strings: רכז קבועים/Enums במקום מחרוזות מפוזרות.

מתי Copilot אמור להתנהג כך:
- כל בקשה למיגרציה/המרה של קוד React/JSX צריכה להחזיר: (1) קובץ `index.html` או HTML snippet, (2) קובץ CSS עם משתני צבע/spacing אם רלוונטי, (3) קובץ TS מודולרי שמבצע render/interaction ו-typing, (4) service-layer TS לטיפול ב־data.

כללים ל־React → Vanilla תרגום (הנחיות מפורטות):
1) JSX → HTML
  - הוצא כל template JSX ל־HTML סטטי או לתבנית ב־`index.html`.
  - אם יש תנאי רינדור (conditional rendering), המרה ל־placeholder HTML + טיפול ב־DOM להוספה/הסרה באמצעות `element.classList` / `element.hidden` / `parent.appendChild`.
2) props ו-state → TS + DOM
  - props של קומפוננטה נהפכים לפרמטרים של פונקציית render או לאובייקט config שחודר למודול.
  - state של React מוחלף במשתנים מקומיים בתוך מודול TS או ב־Map של רכיבים, ומעודכן באמצעות event listeners:
    - create let count = 0; const update = () => { counterEl.textContent = String(count); };
    - אל תשתמש ב-global state libraries.
3) lifecycle (useEffect, componentDidMount)
  - המרה ל־`document.addEventListener('DOMContentLoaded', ...)` או לפונקציית `init()` שמופעלת בסקריפט ההטענה.
4) event handlers
  - המרה ל־`element.addEventListener('click', handler)`; השתמש ב־delegation כאשר יש רשימות דינמיות.

Data access / החלפת `@base44/sdk`:
- אין להשתמש ב־`@base44/sdk`.
- אם הקוד הרפרנס קורא ל־SDK — החלף קריאות אלה בשירותי TS שמטענים/שומרים מקומית לקבצי JSON בתיקיית `data/`.
- ספק Service API ברור: לדוגמה `services/publishers.ts` שמייצא:
  - `export type Publisher = { id: string; name: string; ... }`
  - `export async function loadPublishers(): Promise<Publisher[]>` — טוען `data/publishers.json` בעזרת `fetch('/data/publishers.json')` (או import סטרימי בקובץ build), ובודק טיפוסים בסיסיים.
- כל צד שרת/חיבור חיצוני צריך להיות מפורש בדף README או בשירות נפרד — אל תשלב SDK חיצוני בפרונט.

מבנה קבצים מומלץ (קטן וברור):
- `public/index.html` — HTML תבנית ראשית
- `public/styles.css` — סגנונות גלובליים
- `src/main.ts` — entry שמאתחל את ה־UI ומחבר שירותים
- `src/ui/` — מודולים של render (e.g., `publisherList.ts`)
- `src/services/` — data access (e.g., `publishers.ts`, `config.ts`)
- `src/types/` — Interfaces וטיפוסים
- `data/` — קבצי JSON מקוריים (למשל `publishers.json`, `publisher-aurora.json`)

Style guide (קוד TypeScript):
- טיפוסים ברורים: השתמש ב־`interface`/`type` לכל מבנה נתונים.
- נמנע מ־`any`. אם אין ברירה — הסבר בתגובה (comment) מדוע.
- פונקציות קצרות, שמות משמעותיים: `renderX`, `attachListeners`, `formatDate`.
- שימוש ב־`const`/`let` נכון; המרות לא־מוטציות כאשר אפשר.
- קבצי TS צריכים להיות מודולים (export/import), לא סקריפטים גלובליים.

הנחיות להתנהגות Copilot בעת מיגרציה:
- בקשה לדוגמה: "Convert this Base44 React component to Vanilla TS" — תשיב בשלושה חלקים:
  1. תמצית קצרה (2–4 שורות) שמסבירה מה הייתה הקומפוננטה ומה המטרות שלה.
  2. HTML שייצג את ה־template (או `index.html` snippet).
  3. `styles.css` קצר (רק מה שנדרש) + `component.ts` עם טיפוסים, פונקציות render, ו־event handlers, וכן service usage במקום SDK.
  4. הסבר קצר של השינויים: איך ה־JSX הורחק, איך ה־state הומר ל־DOM/TS, ואיפה הוצבו קריאות ל־data.

דוגמא מהירה (מיקרו־תבנית להבהרה):
-- מקור (React, SPEC):
  - קומפוננטה שמציגה רשימת publishers עם לחצן expand לכל פריט.
-- מטרה (Vanilla TS):
  - `index.html` כולל `<ul id="publishers"></ul>`.
  - `styles.css` עבור מראה בסיסי.
  - `src/ui/publisherList.ts`:
    - טיפוס `Publisher`.
    - `export function renderPublisherList(container: HTMLElement, items: Publisher[])` שמנקה את ה־container ו־appendChild לכל פריט.
    - `attachListeners` שמאזין ל־click ומעדכן DOM.

הערות ספציפיות למבחן הבית (home assignment):
- תמיד ציין שהמטרה היא להראות כישורי Vanilla TypeScript: קוד מופרד, טיפוסים ברורים, עבודה עם HTML+CSS וקבצי JSON מקומיים.
- הימנע מכל פתרון שמסביר "תתקין ספריה X" — במקום זאת תן מימוש פשוט מקומי.

איך להשתמש בקובץ הוראות זה עם Copilot (קצר):
- שמו את הקובץ בשורש הריפו כ־`frontend.instructions.md` או כ־`.github/copilot-instructions.md` אם רוצים שילוב גלובלי.
- `applyTo` כבר מוגדר ל־`public/**, src/**, data/**` — Copilot ישתמש בהנחיות עבור קבצים באותם נתיבים.
- דוגמא לפרומפט פנימי שתשתמש בו לפני בקשה ממיגרציה:
  "Context: This repo is a Home Assignment. Source component (React) below. Target must be Vanilla TypeScript + HTML + CSS. Produce index.html, styles.css and a TS module implementing the UI and service-layer. Explain the translation." (אפשר להוסיף רשימת קבצי JSON שיש להשתמש בהם.)

סיכום קצר:
- Source: יכול להיות React/Base44.
- Target: תמיד Vanilla TypeScript + HTML + CSS.
- No frameworks, no external SDKs. Data from `data/` or internal TS services.

---

<!-- Usage note: שמו קובץ זה בשורש הריפו כ־`frontend.instructions.md` או ב־`.github/` כ־`copilot-instructions.md`. הקובץ מכסה את התיקיות `public/`, `src/` ו-`data/`. כשמבקשים מ-CoPilot לבצע המרה, תצרפו קונטקסט: הקומפוננטה המקורית ב־React + דוגמאות JSON רלוונטיות. -->
