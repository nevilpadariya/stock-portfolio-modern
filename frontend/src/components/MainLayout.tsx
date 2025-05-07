import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  ShowChart as ShowChartIcon,
  Info as InfoIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'Stock Portfolio Suggestion Engine' }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Results', icon: <ShowChartIcon />, path: '/results' },
    { text: 'About', icon: <InfoIcon />, path: '/about' }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Investmate
          </Link>
        </Typography>
        <ThemeToggle />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={1} 
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 'bold', flexGrow: 1 }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Investmate
            </Link>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Box 
                  key={item.text} 
                  sx={{ 
                    mx: 1.5, 
                    borderBottom: location.pathname === item.path ? 2 : 0,
                    borderColor: 'primary.main',
                    pb: 0.5
                  }}
                >
                  <Link 
                    to={item.path} 
                    style={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center' 
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ ml: 0.5 }}>{item.text}</Typography>
                  </Link>
                </Box>
              ))}
              <ThemeToggle />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 4,
          transition: 'all 0.3s ease'
        }}
      >
        <Box className="page-header">
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
        </Box>
        
        {children}
      </Container>

      <Paper 
        square 
        elevation={2} 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          mt: 'auto',
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : undefined
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Stock Investment Suggestion Engine ©{new Date().getFullYear()} | 
          for CMPE 285
        </Typography>
      </Paper>
    </Box>
  );
};

export default MainLayout; 