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
  
  // Create a theme based on the dark/light mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f7fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#121212',
        secondary: darkMode ? '#aaaaaa' : '#666666',
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
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: darkMode 
                ? '0 8px 20px rgba(0, 0, 0, 0.5)' 
                : '0 8px 20px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 500,
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