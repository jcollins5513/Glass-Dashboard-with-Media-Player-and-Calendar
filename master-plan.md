# Master Plan

This document outlines the high-level roadmap for the Glass Dashboard project. It should only be modified when marking sections as complete at the end of a session.

## Sections

### 1. Project Setup & Baseline
- Set up React + TypeScript workspace and integrate Figma assets.
- Ensure Tailwind CSS is configured for styling.
- Implement baseline components: video player, navigation buttons, media player, etc.

### 2. Google Calendar Integration
- Integrate Google Calendar API to display dealership appointments.
- Show upcoming events in a dedicated component.

### 3. PostgreSQL Database with Prisma
- Configure PostgreSQL database.
- Define `prisma.schema` for inventory and media items.
- Implement Prisma client for data access.

### 4. Inventory Slideshow
- Fetch inventory data from the database.
- Use navigation buttons to select vehicles/media as slideshow images or videos.

### 5. Customer vs Showroom Views
- Provide restricted customer view that only displays shared media.
- Provide showroom view with full navigation.

### 6. Shareable Media Links
- Generate secure links that show specific media in customer view.
- Prevent access to other areas when using a share link.

### 7. Testing & Error Handling
- Set up Jest and ESLint for tests and linting.
- Add error handling for media and network operations.
