import React, { Suspense, lazy, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './App.css';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Loading component
const LoadingComponent = () => (
  <Box 
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

// AppContent component with theme context
const AppContent = () => {
  const { darkMode } = useTheme();
  
  // Create a theme based on the dark/light mode - ChatGPT inspired
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#10a37f' : '#10a37f', // ChatGPT green for both modes
        light: darkMode ? '#1db894' : '#1db894',
        dark: darkMode ? '#0a8c6c' : '#0a8c6c',
      },
      secondary: {
        main: darkMode ? '#444654' : '#f7f7f8', // ChatGPT secondary colors
        light: darkMode ? '#5a5c6d' : '#ffffff',
        dark: darkMode ? '#343541' : '#ececf1',
      },
      background: {
        default: darkMode ? '#343541' : '#ffffff',
        paper: darkMode ? '#444654' : '#f7f7f8',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#343541',
        secondary: darkMode ? '#c5c5d2' : '#6e6e80',
      },
      success: {
        main: '#10a37f',
        dark: '#0a8c6c',
      },
      error: {
        main: '#ef4146',
        dark: '#dc3545',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            transition: 'all 0.2s ease',
            boxShadow: 'none',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
                : '0 4px 15px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            boxShadow: 'none',
          },
          contained: {
            '&:hover': {
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: 'none',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          },
        },
      },
    },
  }), [darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </MuiThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
};

export default App; 