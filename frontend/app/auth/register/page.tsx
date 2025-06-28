'use client';

import { useRouter } from 'next/navigation';
import AuthLayout from '../../../components/auth/AuthLayout';
import AuthForm from '../../../components/auth/AuthForm';
import { useAuthStore } from '../../../stores/authStore';
import { authApi } from '../../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { setLoading, setError, login } = useAuthStore();

  const handleRegister = async (data: { email: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authApi.register({ email: data.email, name: data.email.split('@')[0] });
      login(result.student);
      
      // Immediately redirect to user dashboard after registration
      router.push(`/${result.student.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join Quiz Wizard">
      <AuthForm type="register" onSubmit={handleRegister} />
    </AuthLayout>
  );
}
