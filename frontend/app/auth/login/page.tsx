'use client';

import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthForm from '../../components/auth/AuthForm';
import { useAuthStore } from '../../../stores/authStore';
import { authApi } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { setLoading, setError, login } = useAuthStore();

  const handleLogin = async (data: { email: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authApi.login({ email: data.email });
      login(result.student);
      
      // Redirect to user dashboard
      router.push(`/${result.student.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to Quiz Wizard">
      <AuthForm type="login" onSubmit={handleLogin} />
    </AuthLayout>
  );
}
