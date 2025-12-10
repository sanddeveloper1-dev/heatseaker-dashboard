# HeatSeaker Admin Dashboard

A React TypeScript admin dashboard for managing race data, betting, and system monitoring.

## Project Status

✅ **Initial Setup Complete**
- React + TypeScript + Vite configuration
- All dependencies installed
- Build system configured
- Development server ready

✅ **Backend Wiring Complete**
- All API endpoints documented
- Client-side implementations ready
- See `BACKEND_WIRING.md` for endpoint details

✅ **Testing Setup Complete**
- Vitest configuration
- Basic unit tests
- Contract tests for API
- 32 tests passing

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Project Structure

```
/workspace
├── Components/          # React components
│   ├── api/           # API client
│   ├── auth/          # Authentication context
│   ├── common/        # Shared components
│   ├── layout/        # Layout components
│   └── ui/            # UI component library
├── Pages/             # Page components
├── src/               # Source files
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point
│   └── test/          # Test files
├── api/               # API utilities
├── utils.ts           # Utility functions
└── Layout.tsx         # Main layout wrapper
```

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

## Documentation

- **Backend Wiring**: See `BACKEND_WIRING.md` for API endpoint documentation
- **Setup Requirements**: See `SETUP_REMAINING.md` for remaining setup tasks and improvements

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Features

- 📊 Dashboard with system health monitoring
- 🏇 Race management and viewing
- 📝 System logs viewing
- 📈 Statistics and analytics
- 🧪 API testing console
- 📚 Documentation viewer

## Next Steps

1. **Backend Integration**: Connect to your backend API (see `BACKEND_WIRING.md`)
2. **Environment Configuration**: Set up `.env` file
3. **Fix TypeScript Errors**: Some TypeScript errors remain (see `SETUP_REMAINING.md`)
4. **Add Login Page**: Authentication flow needs a login page
5. **Improve Error Handling**: Add error boundaries and better error messages

## Known Issues

- Some TypeScript errors need to be resolved for production build
- Login page component is missing (referenced but not implemented)
- Custom authentication implementation (no external dependencies)

## Testing

The project includes:
- Unit tests for utilities
- Component tests
- API client tests
- Contract tests for API endpoints

Run tests with:
```bash
npm test
```

## License

[Add your license here]
