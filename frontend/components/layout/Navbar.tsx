import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout, username }) => {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  const handleHomeClick = () => {
    if (isAuthenticated && username) {
      router.push(`/${username}`);
    } else {
      router.push('/');
    }
  };

  return (
    <AppBar position="static" className="bg-green-700">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          className="flex-grow cursor-pointer"
          onClick={handleHomeClick}
        >
          Lizard Quizzard Wizard
        </Typography>
        
        {isAuthenticated && (
          <Box className="flex items-center gap-4">
            <Typography variant="body2" className="text-green-100">
              Welcome, {username || 'User'}!
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              className="text-green-100 hover:text-white"
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 