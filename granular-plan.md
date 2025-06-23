# Granular Plan

## Module: Google Calendar Integration (Next Session)

### Subtasks
1. Set up Google Cloud project & obtain OAuth credentials (client ID/secret) for Calendar API.
2. Create `.env.local` entries for `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.
3. Implement authentication flow:
   - Use `next-auth` with Google provider or manual OAuth if preferred.
   - Persist user sessions securely.
4. Build a server-side function `/app/api/google/calendar/route.ts` that fetches upcoming events for the dealership calendar (read-only scope).
5. Create a new component `CalendarWidget.tsx` that displays:
   - Today’s date/time.
   - A scrollable list of the next N events (title, time, attendee/customer).
6. Add `CalendarWidget` to the dashboard grid (right column beneath Vehicle Details).
7. Style the widget to match Figma glass panel look.
8. Error & loading states (skeleton UI, retry, toast on error).
9. Write unit test for the API util fetching calendar events.

### Context / Dependencies
- Requires Tailwind theme already in place (done).
- Needs secure storage of Google credentials; never commit secrets.
- Uses dealership’s service account/calendar ID (to be provided or mocked).

---

## New Conversation Prompt
```
We’re ready to integrate Google Calendar into the Glass Dashboard.

Please help me:
1. Set up OAuth credentials and environment variables.
2. Implement a Next.js API route that fetches upcoming dealership events from Google Calendar.
3. Create a `CalendarWidget` component styled to match the existing glass UI and insert it into the dashboard.
4. Ensure proper loading/error states and add a simple unit test for the calendar fetch util.
```


## Module: Project Setup & Baseline (Current Session)
- [x] Re-run `tsc --noEmit` and resolve remaining type errors
- [x] Remove remaining version-suffixed imports (`sonner@2.0.3`, `@radix-ui/react-slot@1.1.2`)
- [x] Consolidate shared types in `types/index.ts`
- [x] Update components to use shared types
- [x] Fix remaining type issues in `CustomerVideoPlayer`:
  - [x] Resolve `VehicleStatus` enum usage
  - [x] Fix boolean attribute type issues
  - [x] Update mock data to match shared types
- [x] Update `file-structure.md` with any new files
- [x] Commit baseline working build

## Module: Project Baseline & Structure Fixes
### Subtasks
1. Fix duplicate scripts key in package.json
2. Add @/* import alias in tsconfig.json
3. Decide on router structure (Pages vs App) and adjust API route accordingly
4. Generate Prisma client if needed
5. Confirm dev server runs and API is accessible

### Context/Notes
- No changes to Prisma schema (shared with another project)
- Media items (360, drone) are handled in TypeScript only
- Neon Postgres is the DB
  - [ ] Fix boolean attribute type issues
  - [ ] Update mock data to match shared types
- [ ] Update `file-structure.md` with any new files
- [ ] Commit baseline working build

## Next Steps
- [ ] Align Prisma schema with TypeScript types
- [ ] Regenerate Prisma Client
- [ ] Set up database connection
- [ ] Implement API routes for data fetching
- [ ] Update components to use real data

## New Conversation Prompt
```
Let's continue working on the Glass Dashboard project. Here's what we need to focus on next:

1. First, let's resolve the remaining TypeScript errors in `CustomerVideoPlayer.tsx`:
   - Fix `VehicleStatus` enum usage in mock data
   - Resolve boolean attribute type issues
   - Ensure mock data matches the shared types

2. Once the TypeScript errors are resolved, we should:
   - Run `tsc --noEmit` to verify no type errors remain
   - Update `file-structure.md` with any new files or changes
   - Create a clean baseline commit

3. For the next phase, we can start working on:
   - Aligning the Prisma schema with our TypeScript types
   - Setting up the database connection
   - Implementing API routes for data fetching

Would you like to start with the remaining TypeScript errors, or would you prefer to focus on a different aspect of the project?
```
