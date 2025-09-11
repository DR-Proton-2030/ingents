# Copilot Instructions for Ingents AI Frontend

## Project Overview

This is a Next.js 15 multi-tenant SEO/AI tool application that provides site-specific dashboards and AI-powered services. The architecture uses dynamic routing with `[site]` parameters to create isolated environments for different clients.

## Key Architectural Patterns

### Multi-tenant Site Structure

- Routes follow `/{site}/{feature}` pattern (e.g., `/google/dashboard`, `/facebook/seo-management`)
- Site context is managed via `SiteContext` (`src/contexts/SiteContext.tsx`) - always use `useSite()` hook to access current site
- Dynamic routing handled through `src/app/[site]/` directory with proper metadata generation per site

### Component Organization

```
src/components/
├── shared/          # Cross-feature UI (Sidebar, Navbar, Layout)
├── dashboard/       # Dashboard-specific components
├── result/          # SEO analysis result components
├── chat/           # Chat interface components
└── ui/             # Shadcn/ui base components
```

### Screen-based Architecture

- Pages import from `src/screens/` directory which orchestrate component layouts
- Example: `src/app/[site]/page.tsx` → `src/screens/dashbard/Dashbaord.tsx` → individual components
- Layout wrapper in `src/screens/layout/Layout.tsx` handles sidebar, navbar, and aurora gradient backgrounds

## Development Patterns

### Styling Conventions

- Uses Tailwind CSS v4 with Shadcn/ui "new-york" style
- Consistent gradient backgrounds via absolute positioned divs with negative z-index
- `hidescroll` class used throughout for overflow management
- Responsive grid layouts: `grid-cols-1 lg:grid-cols-12` pattern

### API Integration

- Next.js API routes in `src/app/api/` handle backend communication
- Example pattern in `src/app/api/analyze/route.ts`: hardcoded API keys, fallback URL attempts, structured error handling
- Always validate request body with proper TypeScript typing

### State Management

- React Context for site-specific state (`SiteContext`)
- No global state library - relies on prop drilling and context
- Site parameter accessible via `useSite()` hook throughout component tree

## Essential Workflows

### Development Setup

```bash
npm run dev --turbopack  # Uses Turbopack for faster builds
npm run build --turbopack
npm run lint
```

### Adding New Features

1. Create page in `src/app/[site]/feature-name/page.tsx`
2. Build screen component in `src/screens/feature-name/`
3. Add navigation item to `Sidebar.tsx` `todayItems` or `bottomItems`
4. Use site context: `const { site, siteUrl } = useSite()`

### Component Development

- Follow Shadcn/ui patterns for new UI components in `src/components/ui/`
- Use `cn()` utility from `src/lib/utils.ts` for className merging
- Implement forwardRef pattern for reusable components

## Critical Integration Points

### Navigation Structure

- Sidebar navigation in `src/components/shared/sidebar/Sidebar.tsx` defines main app structure
- Items use site-aware routing: `href: \`/\${site}/feature\``
- Navigation organized into "AGENTS" section (main features) and bottom utility links

### Theme and Styling

- Aurora gradient background system in Layout.tsx using multiple absolute positioned divs
- Responsive design with mobile-first approach
- Dark/light theme support via `next-themes` (though not extensively implemented)

### Backend Communication

- API routes proxy to external Python backend (localhost:5000)
- Hardcoded API keys for Gemini, PageSpeed, and SerpAPI in analyze route
- Error handling includes connection fallbacks and structured error responses

## Common Gotchas

- Site parameter is always available in `[site]` routes - don't hardcode site names
- Components often have empty files - check implementation before assuming functionality
- Typo in dashboard folder: `src/screens/dashbard/` (missing 'o')
- Gradient backgrounds require careful z-index management (`-z-10` for backgrounds)
- Use absolute paths with `@/` alias consistently

## Key Files to Reference

- `src/contexts/SiteContext.tsx` - Site state management pattern
- `src/components/shared/sidebar/Sidebar.tsx` - Navigation structure
- `src/screens/layout/Layout.tsx` - Main layout and background system
- `src/app/api/analyze/route.ts` - API integration pattern
- `components.json` - Shadcn/ui configuration
