# Texas ISD Audit Parser

A comprehensive client-side web application for parsing Texas Independent School District (ISD) audit PDFs and extracting key financial data. This tool provides an intuitive interface for analyzing municipal bond data, school district finances, and city fiscal metrics.

## Features

### 🔍 PDF Audit Parser
- **Client-side PDF parsing** using PDF.js - no server required
- **Automatic data extraction** for Net Position, Fund Balance, Revenues, and Expenditures
- **Manual entry fallback** with editable forms and validation
- **Multiple export formats** - JSON and CSV downloads
- **Local storage** for saving and reloading previous reports

### 🛠️ Developer Tools
- **Debug panel** with PDF text analysis, section matching, and regex results
- **Settings modal** for configuration and storage management
- **Input validation** with file size limits and type checking

### 📊 Dashboard & Analytics
- Interactive Texas map with debt visualization
- Bond tracking and search functionality
- Municipal data exploration
- Financial metrics and trends

### 🚀 GitHub Pages Compatible
- Pure client-side application
- No backend dependencies
- Optimized static build process

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **PDF Processing**: PDF.js
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React hooks + TanStack Query
- **Routing**: Wouter

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
The build output will be in the `dist/public` directory, ready for GitHub Pages deployment.

### File Structure
```
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── utils/         # PDF parsing and storage utilities
│   └── types/         # TypeScript type definitions
├── shared/            # Common schemas and types
└── dist/public/       # Production build output
```

## Usage

1. **Upload PDF**: Select a Texas ISD audit PDF file (max 50MB)
2. **Review Data**: Check extracted financial information
3. **Manual Corrections**: Use the collapsible form to edit any values
4. **Export**: Download data as JSON or CSV
5. **Save Reports**: Previous analyses are stored locally for quick access

## Security & Validation

- File type validation (PDF only)
- File size limits (50MB maximum)
- Input sanitization for numeric fields
- No external API dependencies
- Client-side processing only

## Browser Support

- Modern browsers with ES2020+ support
- PDF.js compatibility required
- Local storage enabled

## License

Open source project for educational and research purposes.

## Version

Current version: 1.0.0