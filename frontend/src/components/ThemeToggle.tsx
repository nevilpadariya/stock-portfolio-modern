import React from 'react';
import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const theme = useMuiTheme();

  return (
    <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle dark/light mode"
        sx={{
          ml: 1,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'rotate(30deg)',
          },
          color: theme.palette.mode === 'dark' ? 'yellow' : 'inherit',
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 