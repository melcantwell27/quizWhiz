'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAuthStore } from '../../stores/authStore';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: { email: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const { isLoading, error, clearError } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // 
    onSubmit({ email });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        margin="normal"
        value={email}
        onChange={handleEmailChange}
        autoComplete="email"
        required
        error={!!error}
        helperText={error}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? 'Loading...' : (type === 'login' ? 'Login' : 'Register')}
      </Button>
    </form>
  );
};

export default AuthForm; 