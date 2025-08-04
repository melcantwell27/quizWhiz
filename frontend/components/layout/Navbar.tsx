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
  studentId?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout, username, studentId }) => {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  const handleHomeClick = () => {
    if (isAuthenticated) {
      router.push(`/student/${studentId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          className="flex-grow cursor-pointer"
          onClick={handleHomeClick}
        >
          Lizard Quizzard Wizard
        </Typography>
        
        {isAuthenticated && (
          <Box className="flex items-center gap-4">
            <Button 
              color="inherit" 
              onClick={handleLogout}
              className="text-white hover:text-white"
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