
# CRM Application

A modern, beautifully-designed Customer Relationship Management (CRM) application built with React, TypeScript, and a minimalist design approach inspired by the best UI/UX practices.

## Features

- **OAuth2 Authentication**: Secure login using OAuth2 code grant flow
- **Customer Management**: Add, view, and manage customer information
- **Contact Management**: Track multiple contacts for each customer
- **Activity Tracking**: Log calls, emails, meetings, and tasks
- **Modern UI**: Clean, minimalist design with smooth animations
- **Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

This application is built using:

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast development and building
- **React Router** - Routing
- **Tanstack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Framer Motion** - Animations
- **Playwright** - Testing

## Project Structure

The application follows a modular architecture for easy maintenance and scalability:

```
src/
  ├── components/         # Reusable UI components
  │   ├── common/         # Common utility components
  │   ├── ui/             # shadcn UI components
  │   └── navigation/     # Navigation-related components
  ├── layouts/            # Page layout components
  ├── hooks/              # Custom React hooks
  ├── pages/              # Page components
  ├── services/           # API and service layer
  ├── stores/             # Zustand state stores
  ├── tests/              # Playwright tests
  ├── lib/                # Utility functions and libraries
  ├── App.tsx             # Main application component
  └── main.tsx           # Application entry point
```

## Authentication Flow

The application uses OAuth2 code grant flow for authentication:

1. User clicks "Sign in with OAuth"
2. The application redirects to the OAuth provider
3. After authentication, the provider redirects back with a code
4. The application exchanges the code for access and refresh tokens
5. Tokens are stored securely and used for API requests

## API Integration

The application is designed to work with a backend API that provides:

- Authentication endpoints
- Customer management
- Contact management
- Activity tracking

## Development and Expansion

This CRM is designed as a foundation for further development. You can expand it by adding:

- Invoicing and billing features
- Project management
- Document management
- Sales pipeline tracking
- Custom reporting
- Calendar and task management
- Email integration

## Testing

The application includes Playwright tests covering:

- Authentication flows
- Customer management
- Navigation

To run tests:

```bash
npx playwright test
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure environment variables
4. Start the development server with `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_API_URL=https://your-api-url.com
VITE_OAUTH_URL=https://your-oauth-provider.com/oauth/authorize
VITE_OAUTH_CLIENT_ID=your-client-id
```
