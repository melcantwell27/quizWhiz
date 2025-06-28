'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

// Lizard-inspired palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#43b649', // Vibrant lizard green
      light: '#7be495', // Soft green highlight
      dark: '#2a7c3a', // Deep green for contrast
      contrastText: '#fff',
    },
    secondary: {
      main: '#1ecbe1', // Turquoise/blue-green
      light: '#7ee6f7',
      dark: '#1696a7',
      contrastText: '#fff',
    },
    success: {
      main: '#b6e51e', // Yellow-green accent
      contrastText: '#2a7c3a',
    },
    background: {
      default: '#f4fff7', // Very light green background
      paper: '#e8f5e9', // Slightly deeper green for cards
    },
    text: {
      primary: '#1b3a1b', // Deep green for text
      secondary: '#388e3c', // Softer green for secondary text
    },
    warning: {
      main: '#ffe066', // Soft yellow for warnings
    },
    error: {
      main: '#e53935',
    },
    info: {
      main: '#1ecbe1',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
} 