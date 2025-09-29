# URL Shortener

A modern, full-featured URL shortening application built with Next.js, TypeScript, and Material-UI. This application allows users to create shortened URLs with analytics tracking and provides a clean, responsive interface.

## Features

- ✨ **URL Shortening**: Convert long URLs into short, shareable links
- 📊 **Analytics Dashboard**: Track and analyze URL usage statistics
- 🎨 **Modern UI**: Clean, responsive interface built with Material-UI
- 🚀 **Fast Performance**: Built with Next.js for optimal performance
- 🔗 **Simple Navigation**: Clean navigation between main features

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material-UI Icons
- **Font**: Inter (Google Fonts)

## Project Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── not-found.tsx      # 404 page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Navigation.tsx     # Clean navigation bar
│   │   ├── UrlShortenerForm.tsx # URL shortening form
│   │   ├── StatisticsPage.tsx # Analytics dashboard
│   │   ├── RedirectPage.tsx   # URL redirect handler
│   │   └── providers/         # Context providers
│   ├── services/              # API services
│   │   └── urlService.ts      # URL management service
│   ├── types/                 # TypeScript type definitions
│   │   └── url.ts             # URL-related types
│   └── theme/                 # Theme configuration
├── public/                    # Static assets
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. **Navigate to the Frontend directory:**
```bash
cd Frontend
```

3. **Install dependencies:**
```bash
npm install
# or
yarn install
```

4. **Start the development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Components Overview

### Navigation Component
The Navigation component provides:
- **Clean, minimal navigation bar**
- **Shorten URLs**: Main page for creating shortened links
- **Statistics**: Analytics dashboard with dedicated icon
- **Active route highlighting** with Material-UI variants
- **Responsive design** with Material-UI Container and AppBar
- **Streamlined performance** without logging overhead

### URL Shortener Form
- Input validation for URLs
- Form handling with TypeScript
- Real-time feedback and error handling

### Statistics Dashboard
- Comprehensive analytics for shortened URLs
- Interactive data visualization
- Export functionality for data analysis

## Key Features Implementation

### Clean Navigation
The navigation component focuses on core functionality:
- Simple route switching between main features
- Visual feedback for active routes
- Responsive Material-UI design
- Optimized performance

### URL Management
- Create and manage shortened URLs
- Track analytics and user engagement
- URL validation and error handling

### User Experience
- Material-UI components for consistent design
- Loading states and user feedback
- Responsive layout for all screen sizes
- Clean, modern interface design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement responsive design with Material-UI
- Write clean, documented code
- Use Material-UI components consistently
- Focus on performance and simplicity

## Live Demo
https://url-shortner-sable-ten.vercel.app/


---
