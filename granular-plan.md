# Granular Plan

## Module: Debug and Finalize Google Calendar & Dashboard Styling

### Objective
Resolve the persistent styling and authentication issues to achieve a fully functional and visually correct dashboard.

### Subtasks
1.  **Diagnose and Fix Styling/Layout:**
    - [ ] Investigate why Tailwind CSS styles are not being applied despite configuration changes.
    - [ ] Verify the CSS build process, including `postcss.config.js` and how `globals.css` is imported and processed.
    - [ ] Ensure the main grid layout (`grid-cols-4 grid-rows-2`) is correctly applied to `ShowroomApp`.
    - [ ] Confirm the dashboard renders with the intended glassmorphism effect and color scheme.

2.  **Diagnose and Fix Session Persistence:**
    - [ ] Investigate why the `next-auth` session is not persisting across page loads.
    - [ ] Double-check the `.env.local` file for the correct `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
    - [ ] Review the `app/api/auth/[...nextauth]/route.ts` configuration for any issues with session or JWT callbacks.
    - [ ] Ensure cookies are being set correctly by the browser.

3.  **Validation:**
    - [ ] Once fixes are applied, restart the server.
    - [ ] Log in with Google and confirm the session persists after a page refresh.
    - [ ] Verify that the dashboard layout is correct and all components are styled properly.
    - [ ] Confirm the `CalendarWidget` successfully fetches and displays events.

---

## New Conversation Prompt

Hello, let's pick up where we left off. The dashboard is still facing two critical issues:

1.  **Broken Styles & Layout:** The application is not loading its CSS correctly, resulting in an unstyled, stacked layout.
2.  **No Persistent Login:** We have to re-authenticate with Google on every visit.

Please help me debug and fix these two problems so we can get the dashboard fully functional. Let's start by investigating the styling issue.
