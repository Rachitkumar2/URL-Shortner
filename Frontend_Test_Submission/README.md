# URL Shortener Web Application

A modern, user-friendly URL shortener web application built with React, Next.js, TypeScript, and Material UI.

## 🚀 Features

### Core Functionality
- **Bulk URL Shortening**: Shorten up to 5 URLs simultaneously
- **Custom Shortcodes**: Optional user-defined shortcodes or auto-generated unique codes
- **Expiry Management**: Configurable validity periods (default: 30 minutes)
- **Smart Redirection**: Client-side routing with click tracking
- **Real-time Analytics**: Comprehensive statistics and click tracking

### Technical Features
- **Custom Logging Middleware**: Structured logging without console outputs
- **Client-side Validation**: Real-time URL and shortcode validation
- **Local Storage**: Persistent data storage in browser
- **Responsive Design**: Mobile-friendly Material UI interface
- **Error Handling**: User-friendly error messages and edge case handling

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **Styling**: Material UI components + custom CSS
- **State Management**: React hooks
- **Storage**: LocalStorage & SessionStorage
- **Development**: Node.js, npm

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

## 🔧 Installation & Setup

1. **Clone/Navigate to the project directory**:
   ```bash
   cd Frontend_Test_Submission
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📱 Application Structure

### Pages
- **Home (`/`)**: URL shortening interface
- **Statistics (`/statistics`)**: Analytics and management dashboard
- **Redirect (`/:shortcode`)**: Dynamic redirect handler

### Key Components
- `UrlShortenerForm`: Main shortening interface
- `StatisticsPage`: Analytics dashboard
- `RedirectPage`: Redirect handling
- `Navigation`: App navigation
- `MuiThemeProvider`: Theme configuration

### Services
- `urlService`: Core business logic for URL operations
- `logger`: Custom logging middleware

## 🎯 Usage Guide

### Shortening URLs

1. **Enter URLs**: Input up to 5 URLs in the form
2. **Set Validity**: Configure expiry time in minutes (default: 30)
3. **Custom Shortcode**: Optionally specify custom shortcodes
4. **Submit**: Click "Shorten URLs" to generate short links
5. **Copy Links**: Use the copy button to copy shortened URLs

### Managing URLs

1. **View Statistics**: Navigate to the Statistics page
2. **Track Clicks**: View click counts and detailed analytics
3. **Click Details**: See timestamp, source, and user location
4. **Manage URLs**: Delete individual URLs or clear all

### Using Short URLs

1. **Access**: Visit `http://localhost:3000/{shortcode}`
2. **Redirect**: Automatic redirection to original URL
3. **Tracking**: Click information is recorded automatically
4. **Expiry**: Expired links show appropriate error messages

## 🔍 Features Detail

### URL Validation
- Protocol validation (HTTP/HTTPS only)
- URL format validation
- Shortcode uniqueness checking
- Alphanumeric shortcode constraints

### Analytics
- **Click Tracking**: Timestamp, source, coarse location
- **URL Management**: Creation time, expiry status
- **Statistics Dashboard**: Total URLs, active URLs, total clicks
- **Detailed Views**: Individual URL analytics

### Error Handling
- Invalid URL formats
- Duplicate shortcodes
- Expired URLs
- Non-existent shortcuts
- Network errors

### Security Features
- Client-side validation
- XSS prevention
- Safe URL handling
- Coarse-grained location tracking

## 📊 Logging System

The application includes a custom logging middleware that:
- Records all application events
- Stores logs in sessionStorage
- Provides structured logging without console outputs
- Includes contextual information and sources

### Log Types
- `info`: General application events
- `warn`: Warning conditions
- `error`: Error conditions
- `debug`: Debug information

## 🎨 UI/UX Features

### Material UI Design
- Consistent Material Design principles
- Custom theme with primary/secondary colors
- Responsive grid layouts
- Accessible components

### User Experience
- Intuitive navigation
- Real-time validation feedback
- Copy-to-clipboard functionality
- Loading states and error messages
- Mobile-responsive design

## 🔄 URL Redirection Flow

1. User visits short URL (`/shortcode`)
2. Next.js rewrites to `/redirect/shortcode`
3. RedirectPage component handles the request
4. URL validation and expiry checking
5. Click recording and analytics
6. Automatic redirection to original URL

## 💾 Data Storage

### LocalStorage
- Shortened URLs and metadata
- Click records and analytics
- Persistent across browser sessions

### SessionStorage
- Application logs
- Temporary UI state
- Session-specific data

## 🚦 Error States

### Handled Scenarios
- **Invalid URLs**: Clear validation messages
- **Expired Links**: Graceful degradation with original URL access
- **Missing Links**: 404-style error page
- **Network Issues**: Retry mechanisms and error display
- **Storage Limits**: Automatic cleanup and management

## 🔧 Configuration

### Environment
- Runs exclusively on `http://localhost:3000`
- No external API dependencies
- Client-side only operation

### Customization
- Theme colors in `src/theme/theme.ts`
- Validation rules in `src/services/urlService.ts`
- Log settings in `src/middleware/logger.ts`

## 📁 Project Structure

```
Frontend_Test_Submission/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── statistics/        # Statistics page
│   │   ├── redirect/          # Dynamic redirect routes
│   │   └── not-found.tsx      # 404 page
│   ├── components/            # React components
│   │   ├── providers/         # Context providers
│   │   ├── UrlShortenerForm.tsx
│   │   ├── StatisticsPage.tsx
│   │   ├── RedirectPage.tsx
│   │   └── Navigation.tsx
│   ├── services/              # Business logic
│   │   └── urlService.ts
│   ├── middleware/            # Logging middleware
│   │   └── logger.ts
│   ├── types/                 # TypeScript types
│   │   └── url.ts
│   └── theme/                 # UI theme
│       └── theme.ts
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🚀 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Development Notes

### Key Implementation Details
- Uses crypto.randomUUID() for unique IDs
- Implements client-side routing for redirects
- Material UI theming for consistent design
- TypeScript for type safety
- Custom logging without console outputs

### Performance Considerations
- Efficient local storage management
- Optimized re-renders with React hooks
- Lazy loading where appropriate
- Memory-efficient logging system

## 🔮 Future Enhancements

Potential improvements for production use:
- User authentication and authorization
- Server-side storage and APIs
- Advanced analytics and reporting
- Bulk operations and CSV import/export
- QR code generation
- Custom domains support
- Rate limiting and abuse prevention

## 📞 Support

For issues or questions:
1. Check the browser console for any client-side errors
2. Verify that the development server is running
3. Ensure all dependencies are properly installed
4. Check that localStorage/sessionStorage is enabled

---

**Built with ❤️ using React, Next.js, TypeScript, and Material UI**
