# Lizard Quizzard Wizard Frontend

A Next.js 15 application with authentication and dashboard functionality.

## Features

- **Authentication System**: Login and registration with Django backend
- **Global Navigation**: Navbar with logout accessible from anywhere when authenticated
- **Student Dashboard**: Personalized dashboard with welcome message and stats
- **Responsive Design**: Built with Material-UI and custom theme
- **State Management**: Zustand for auth state management

## Structure

```
app/
├── auth/                    # Auth pages
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
├── components/
│   ├── auth/               # Reusable auth components
│   │   ├── AuthForm.tsx    # Login/Register form
│   │   ├── AuthLayout.tsx  # Auth page layout
│   │   └── PasswordInput.tsx
│   └── layout/             # Layout components
│       ├── Navbar.tsx      # Global navigation bar
│       └── NavbarWrapper.tsx # Conditional navbar wrapper
├── stores/
│   └── authStore.ts        # Zustand auth state management
├── [studentId]/            # Dynamic student dashboard
│   └── page.tsx
├── layout.tsx              # Root layout with theme provider
├── page.tsx                # Home page
└── providers/
    └── ThemeProvider.tsx   # MUI theme provider
```

## Key Components

### Global Navbar
- Shows when user is authenticated
- Contains "Lizard Quizzard Wizard" title and logout button
- Automatically appears on all authenticated pages

### Student Dashboard
- Welcome message with student name
- Stats cards (quizzes completed, current streak, student ID)
- Available quizzes section
- Clean, focused design without logout button (handled by navbar)

### Authentication Flow
1. User visits home page
2. If authenticated, redirects to `/{student.id}` dashboard
3. If not authenticated, shows login/register options
4. After login/register, redirects to dashboard
5. Logout available globally via navbar

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Backend Integration

- Django REST API running on `http://localhost:8000`
- CORS configured for frontend development
- Authentication endpoints:
  - `POST /api/students/` - Registration
  - `POST /api/students/login/` - Login

## Theme

Custom Material-UI theme inspired by lizard colors:
- Primary: Green (#2E7D32)
- Secondary: Teal (#1ECBE1)
- Background gradients and modern styling
