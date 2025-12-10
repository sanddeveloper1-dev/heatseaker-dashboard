# Remaining Setup Requirements

This document outlines what remains to be done after initial setup and backend wiring to get this project ready for local hosting usage.

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Optional: Override default API URL
# VITE_API_BASE_URL=https://api.example.com
```

### Environment File Setup

1. **Create `.env` file**:
   ```bash
   cp .env.example .env  # If example exists
   # Or create manually
   ```

2. **Update `Components/api/apiClient.tsx`** to use environment variable:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
   ```

3. **Add to `.gitignore`** (see below)

## .gitignore Configuration

Create or update `.gitignore` file with the following entries:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
*.log

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# TypeScript
*.tsbuildinfo

# Vite
.vite/

# Optional: Keep these if needed
# .env.example
# .env.template
```

## Secrets and Sensitive Data

### Items to Add to .gitignore

1. **Environment files** (already listed above)
2. **API Keys** (if any are added in the future)
3. **Authentication tokens** (handled client-side in localStorage, but ensure no tokens are committed)
4. **Build artifacts** with sensitive data

### Security Best Practices

1. **Never commit**:
   - `.env` files
   - API keys or secrets
   - Authentication tokens
   - Personal credentials

2. **Use environment variables** for:
   - API base URLs
   - Feature flags
   - Third-party service keys (if needed)

3. **Client-side storage**:
   - Current implementation uses `localStorage` for tokens
   - Consider implementing secure token refresh mechanism
   - Add token expiration handling

## Missing Configuration Files

### 1. ESLint Configuration (Optional but Recommended)

Create `.eslintrc.cjs`:
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

### 2. Vitest Configuration (For Testing)

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### 3. Test Setup File

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

## Code Improvements Needed

### 1. TypeScript Type Safety

**Current Issues:**
- Many components have implicit `any` types
- Missing type definitions for API responses
- Props interfaces not fully defined

**Recommended Actions:**
- Add proper TypeScript interfaces for all API responses
- Create shared types file (`src/types/api.ts`)
- Add type guards for API responses
- Fix remaining `any` types in components

### 2. Error Handling

**Current Issues:**
- Basic error handling exists but could be improved
- No centralized error handling strategy
- Toast notifications not consistently used

**Recommended Actions:**
- Create error boundary component
- Implement global error handler
- Add retry logic for failed API calls
- Improve error messages for users

### 3. API Client Improvements

**Current Issues:**
- Hardcoded API base URL
- No request/response interceptors
- Limited error handling

**Recommended Actions:**
- Use environment variable for API URL
- Add request/response interceptors
- Implement request retry logic
- Add request cancellation support
- Implement request caching where appropriate

### 4. Authentication Flow

**Current Issues:**
- No login page implementation
- Token refresh not implemented
- No session timeout handling

**Recommended Actions:**
- Create login page component
- Implement token refresh mechanism
- Add session timeout warning
- Implement "remember me" functionality
- Add password reset flow (if needed)

### 5. State Management

**Current Issues:**
- Using React Context for auth (good for small app)
- No global state management for complex data
- Potential prop drilling in some components

**Recommended Actions:**
- Consider adding Zustand or Redux if state becomes complex
- Implement proper caching for API responses
- Add optimistic updates where appropriate

### 6. Performance Optimizations

**Current Issues:**
- No code splitting implemented
- Large bundle size potential
- No lazy loading for routes

**Recommended Actions:**
- Implement React.lazy() for route-based code splitting
- Add loading states for lazy-loaded components
- Optimize bundle size with tree shaking
- Add service worker for offline support (optional)

### 7. Accessibility (a11y)

**Current Issues:**
- Missing ARIA labels in some components
- Keyboard navigation not fully tested
- Focus management could be improved

**Recommended Actions:**
- Add ARIA labels to all interactive elements
- Test keyboard navigation
- Implement focus traps for modals
- Add skip navigation links
- Ensure color contrast meets WCAG standards

### 8. Component Organization

**Current Issues:**
- Some components are quite large
- Could benefit from better separation of concerns
- Reusable components could be extracted

**Recommended Actions:**
- Break down large components into smaller ones
- Extract reusable logic into custom hooks
- Create shared component library structure
- Add Storybook for component documentation (optional)

### 9. Testing Coverage

**Current Issues:**
- No tests currently exist
- Critical paths not covered

**Recommended Actions:**
- Add unit tests for utility functions
- Add component tests for critical UI
- Add integration tests for API flows
- Add E2E tests for user journeys

### 10. Documentation

**Current Issues:**
- Limited inline code documentation
- No component API documentation

**Recommended Actions:**
- Add JSDoc comments to functions
- Document component props with TypeScript
- Create component usage examples
- Add README with setup instructions

## Local Development Setup Checklist

- [x] Install dependencies (`npm install`)
- [x] Create build configuration
- [x] Setup TypeScript
- [ ] Create `.env` file with API URL
- [ ] Update API client to use environment variable
- [ ] Create `.gitignore` file
- [ ] Fix remaining TypeScript errors
- [ ] Setup ESLint (optional)
- [ ] Create test configuration
- [ ] Add login page (if authentication required)
- [ ] Test local development server (`npm run dev`)
- [ ] Verify build process (`npm run build`)

## Production Deployment Checklist

- [ ] Set up production environment variables
- [ ] Configure production API URL
- [ ] Optimize build output
- [ ] Set up CI/CD pipeline
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up analytics (if needed)
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificates
- [ ] Configure CORS on backend
- [ ] Test production build locally
- [ ] Performance testing
- [ ] Security audit

## Known Issues

1. **TypeScript Errors**: Some TypeScript errors remain and need to be fixed for production build
2. **Missing Login Page**: Authentication flow references `/Login` route but page doesn't exist
3. **Authentication Flow**: Custom authentication is implemented using JWT tokens stored in localStorage
4. **Select Component**: Simplified dropdown implementation - consider using a proper library
5. **No Error Boundary**: Application will crash on unhandled errors

## Next Steps Priority

1. **High Priority**:
   - Fix TypeScript errors
   - Create `.env` file and update API client
   - Add `.gitignore` file
   - Create login page

2. **Medium Priority**:
   - Improve error handling
   - Add proper TypeScript types
   - Implement token refresh
   - Add tests

3. **Low Priority**:
   - Performance optimizations
   - Accessibility improvements
   - Additional documentation
