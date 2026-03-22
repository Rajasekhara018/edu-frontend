# Electrical Sales Application

This is an Angular-based electrical items sales application built with Angular 16, Material Design, Bootstrap, and Tailwind CSS.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 16

## Installation

1. Install dependencies:
```bash
npm install
```

## Development Server

Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` or `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run `npm test` or `ng test` to execute the unit tests via Karma.

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   ├── Services/            # Services and utilities
│   ├── app.module.ts        # Main app module
│   ├── app-routing.module.ts # App routing configuration
│   ├── app.component.ts     # Root component
│   └── ...
├── assets/                  # Static assets
├── environments/            # Environment configurations
├── styles.scss             # Global styles
└── main.ts                 # Application entry point
```

## Technology Stack

- **Framework**: Angular 16.2.0
- **UI Library**: Angular Material 16.2.14
- **CSS Framework**: Bootstrap 5.3.7, Tailwind CSS 3.4.17
- **Styling**: SCSS
- **State Management**: RxJS 7.8.0
- **HTTP Client**: HttpClientModule
- **Testing**: Karma & Jasmine

## Configuration Files

- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.angular-cli.json` - Additional CLI options

## Docker

To build and run the application in Docker:

```bash
docker build -t electrical-sales .
docker run -p 8080:8080 electrical-sales
```

## License

This project is private and proprietary.
