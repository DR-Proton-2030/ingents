<div align="center">

# 🚀 Ingents AI Frontend

**Next.js 15 Multi-Tenant SEO & AI Analytics Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)

_Empowering businesses with intelligent SEO insights and AI-driven analytics_

</div>

---

## 🌟 Overview

Ingents AI is a cutting-edge multi-tenant SEO and AI analytics platform built with Next.js 15. It provides site-specific dashboards, comprehensive SEO analysis, social media management, and AI-powered insights for businesses of all sizes.

### ✨ Key Features

- 🎯 **Multi-Tenant Architecture** - Isolated environments for different clients
- 📊 **SEO Analytics Dashboard** - Comprehensive site performance insights
- 🤖 **AI-Powered Analysis** - Smart recommendations and automated reporting
- 📱 **Social Media Management** - Integrated social platform analytics
- 💰 **Finance AI Tools** - Business intelligence and financial insights
- 🎨 **Beautiful Aurora UI** - Stunning gradient-based design system
- ⚡ **High Performance** - Turbopack-powered development and builds

---

## 🏗️ Architecture

### Multi-Tenant Structure

```
/{site}/{feature}
├── /google/dashboard          # Google's dedicated dashboard
├── /facebook/seo-management   # Facebook's SEO tools
└── /company/analytics         # Company-specific analytics
```

### Component Organization

```
src/
├── 📁 components/
│   ├── shared/        # Cross-feature UI components
│   ├── dashboard/     # Dashboard-specific components
│   ├── result/        # SEO analysis results
│   ├── chat/          # AI chat interface
│   └── ui/            # Shadcn/ui base components
├── 📁 screens/        # Page-level component orchestration
├── 📁 contexts/       # React Context providers
└── 📁 app/
    ├── [site]/        # Dynamic site routing
    └── api/           # Backend integration routes
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/DR-Proton-2030/ingents.git
cd ingents-ai-frontend

# Install dependencies
npm install

# Start development server with Turbopack
npm run dev --turbopack
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
# Development with Turbopack (recommended)
npm run dev --turbopack

# Production build with Turbopack
npm run build --turbopack

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS 4** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **Radix UI** - Headless component primitives

### Data & State

- **React Context** - Site-specific state management
- **Recharts** - Data visualization
- **Next.js API Routes** - Backend integration

### Development Tools

- **Turbopack** - Ultra-fast bundler
- **ESLint 9** - Code quality
- **PostCSS** - CSS processing

---

## 🎨 Design System

### Aurora Gradient Backgrounds

The application features a stunning aurora-style gradient system with multiple layered backgrounds:

- **Warm orange gradients** for energy and creativity
- **Soft white overlays** for elegance and readability
- **Conic gradients** for dynamic visual interest
- **Responsive design** with mobile-first approach

### Component Patterns

- **Shadcn/ui "new-york" style** for consistent design language
- **forwardRef patterns** for reusable components
- **`cn()` utility** for className composition with tailwind-merge

---

## 🔧 Development Guide

### Adding New Features

1. **Create the route**: `src/app/[site]/feature-name/page.tsx`
2. **Build the screen**: `src/screens/feature-name/FeatureName.tsx`
3. **Add navigation**: Update `Sidebar.tsx` with new menu item
4. **Use site context**: Access via `const { site, siteUrl } = useSite()`

### Site Context Usage

```tsx
import { useSite } from "@/contexts/SiteContext";

function MyComponent() {
  const { site, siteUrl } = useSite();
  return <Link href={`${siteUrl}/dashboard`}>Dashboard</Link>;
}
```

### API Integration Pattern

```typescript
// src/app/api/feature/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  // Validation logic
  // Backend service calls with fallbacks
  // Structured error handling
}
```

---

## 🌐 Multi-Tenant Features

### Site-Specific Routing

Every route is automatically scoped to a specific site/client:

- Dynamic metadata generation per site
- Isolated navigation and branding
- Site-aware component rendering

### Context Management

The `SiteContext` provides site information throughout the component tree:

```tsx
const SiteContext = createContext<{
  site: string;
  siteUrl: string;
}>();
```

---

## 🤖 AI Integration

### Backend Services

- **Gemini AI** - Natural language processing
- **PageSpeed API** - Performance analysis
- **SERP API** - Search ranking insights
- **Custom Analytics** - Proprietary SEO metrics

### Features

- Real-time SEO analysis
- AI-powered recommendations
- Automated report generation
- Intelligent content optimization

---

## 📱 Responsive Design

### Breakpoint System

- **Mobile-first** design approach
- **Grid layouts**: `grid-cols-1 lg:grid-cols-12`
- **Responsive navigation** with collapsible sidebar
- **Aurora gradients** adapt to screen sizes

### Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

---

## 🚀 Performance Optimizations

### Build System

- **Turbopack** for lightning-fast development
- **Next.js 15** App Router for optimal loading
- **Automatic code splitting** by route

### Runtime Performance

- **React 19** concurrent features
- **Optimized fonts** with next/font
- **Image optimization** with next/image
- **CSS-in-JS** with zero runtime overhead

---

## 🔗 API Documentation

### Available Endpoints

- `POST /api/analyze` - SEO analysis and recommendations
- `POST /api/seomi` - Ingents-specific functionality
- `POST /api/social` - Social media analytics

### Authentication

Currently uses hardcoded API keys for external services. Production implementation should use environment variables and proper secret management.

---

## 🛡️ Best Practices

### Code Quality

- **TypeScript** for type safety
- **ESLint** configuration for code consistency
- **Component composition** over inheritance
- **Custom hooks** for reusable logic

### File Organization

- **Absolute imports** with `@/` alias
- **Feature-based** component organization
- **Screens** directory for page orchestration
- **Shared components** for cross-feature UI

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment

```bash
# Build the application
npm run build --turbopack

# Start production server
npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing component patterns
- Use the `useSite()` hook for multi-tenant features
- Implement responsive design for all components
- Add TypeScript types for all new functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions:

- 📧 Email: [support@ingents.ai](mailto:support@ingents.ai)
- 💬 GitHub Issues: [Create an issue](https://github.com/DR-Proton-2030/ingents/issues)
- 📚 Documentation: [Wiki](https://github.com/DR-Proton-2030/ingents/wiki)

---

<div align="center">

**Built with ❤️ by the Ingents AI Team**

[Website](https://ingents.ai) • [Documentation](https://docs.ingents.ai) • [Blog](https://blog.ingents.ai)

</div>
