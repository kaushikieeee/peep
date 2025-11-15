# PEEP — Public Environmental Evidence Portal

## Project Overview
This is a full-stack front-end Next.js app with mobile-first user panel and desktop-only admin dashboard for reporting environmental pollution (land, turf, water, soil).

## Architecture

### Mobile User Panel (`app/peep/user/`)
- **Onboarding**: First-time user walkthrough
- **Home**: Dashboard with nearby reports, sticky CTA button
- **Report Flow**: 5-step stepper for capturing pollution evidence
  - Upload photo (EXIF scrubbing)
  - Select category
  - Set severity
  - Add description
  - Confirm and submit
- **Map**: Mobile map view with pins and modals
- **Profile**: User stats, badges, my reports

### Desktop Admin Panel (`app/peep/admin/`)
- **Layout**: Desktop-only (desktop check, helpful message on mobile)
- **Dashboard**: Stats cards, map, recent reports list
- **Evidence Table**: Full management UI with sort/filter/actions
- **Zone Editor**: Visual zone polygon editor
- **Authority Panel**: Forward to government departments
- **Marketplace**: Service provider invite/bidding

## Design System

### Colors
- **Primary**: `#16a34a` (green-teal)
- **Neutral 1**: `#fafaf8` (off-white)
- **Neutral 2**: `#2d2d2d` (dark gray)
- **Accent**: `#d97706` (warm amber)

### Fonts
- Heading: Geist (via next/font/google)
- Body: Geist (via next/font/google)

### Mobile-First Responsive
- User panel: 375px (mobile) optimized
- Admin: 1366px+ required

## Mock Data
- **Source**: `data/mock-reports.json` (12 reports)
- **Export**: `data/mock-reports.csv`
- **Seed**: `scripts/seed-mock-data.ts` (Node ESM)

## Key Files
- `app/peep/user/page.tsx` — User home
- `app/peep/user/report-flow/*` — Report stepper components
- `app/peep/admin/page.tsx` — Admin dashboard
- `components/peep/evidence-card.tsx` — Reusable evidence display
- `components/peep/map-placeholder.tsx` — Map placeholder
- `app/globals.css` — PEEP color palette

## Preview
- User mobile: Preview at ~375px (mobile device)
- Admin: Full screen desktop (1366px+)

## Accessibility
- Semantic HTML, ARIA roles
- Screen reader text (sr-only)
- Alt text on images
- Tab keyboard navigation
- Min 44px touch targets

## Usage
1. Run seed script: `node scripts/seed-mock-data.ts`
2. Preview mobile: Resize to 375px width
3. Preview admin: Full desktop view
