# Advent Calendar (Next.js)

Create and share a simple advent calendar. Includes:
- Create page with title, description, timezone (auto-detected)
- Edit page with token-based URL for per-day content
- View page that unlocks doors at midnight per day (simplified logic)
- API routes for create/read/update and day content access
- In-memory storage with interface for later DB swap

## Quick Start

```powershell
# Windows PowerShell
npm install
npm run dev
```
Visit http://localhost:3000

- Home: sample calendar
- Create: `/create`
- Edit: `/edit/<id>?token=<token>`
- View: `/view/<id>`

## Deploy to Vercel
- Push to a Git repo
- Import in Vercel, set framework to Next.js
- Later, swap storage to Vercel KV or Postgres

## Notes
- Timezone unlock logic is simplified. For production, use Luxon or Temporal for accurate TZ handling.
- Editor UI is minimal; extend with background, stickers, shapes, images, links.
