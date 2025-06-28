import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <Container maxWidth="xs" className="flex flex-col min-h-screen justify-center items-center">
      <Box className="w-full p-8 bg-white rounded-lg shadow-md">
        <Typography variant="h4" component="h1" gutterBottom className="text-center mb-6">
          {title}
        </Typography>
        {children}
      </Box>
    </Container>
  );
};

export default AuthLayout; 