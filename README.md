# Todo Web App (React + Vite)

Features

- Single-page Todo list displayed as a table (checkbox, category, description, time, status, actions)
- Create (modal), Edit (allowed only for Upcoming and unchecked rows), Delete (permanent)
- Search across description, category, and time
- Filter by Category and toggle Show Completed
- Browser notifications for due-soon and overdue tasks (permission required)
- Local persistence via localStorage

Getting started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open the URL shown by Vite (usually `http://localhost:5173`)

Notes

- Edit is disabled for completed or missed tasks (Missed = due date in the past and not completed).
- Notifications require permission from the browser; allow when prompted.
- All data is stored in your browser's localStorage under `todos-v1`.

Next steps (suggested)

- Add recurring tasks and fine-grained reminders
- Add export/import of todos
- Add unit and e2e tests

Enjoy! 🎯
