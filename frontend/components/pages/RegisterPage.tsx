'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertIcon } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        displayName: formData.displayName || formData.username,
      });

      // Update auth store
      if (response.data?.token && response.data?.user) {
        login(response.data.token, response.data.user);
        router.push('/profile');
      }
    } catch (error: any) {
      // Persian error messages
      let errorMessage = 'خطایی رخ داد. لطفاً دوباره تلاش کن.';
      
      if (error.message) {
        const message = error.message.toLowerCase();
        if (message.includes('email already') || message.includes('ایمیل')) {
          errorMessage = 'این ایمیل قبلاً ثبت شده است';
        } else if (message.includes('username') && message.includes('taken')) {
          errorMessage = 'این نام کاربری قبلاً انتخاب شده است';
        } else if (message.includes('validation')) {
          errorMessage = 'لطفاً تمام فیلدهای الزامی را پر کن';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Transfermarkt-style card */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="bg-tm-green text-white pb-4">
            <CardTitle className="text-2xl font-bold text-center">ثبت‌نام</CardTitle>
            <CardDescription className="text-white/90 text-center mt-2">
              حساب کاربری جدید بساز و شروع کن
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertIcon.Error className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Transfermarkt-style table form */}
              <div className="tm-table-form">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td>نام کاربری *</td>
                      <td>
                        <Input
                          placeholder="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                          className="w-full border-gray-300 focus:border-tm-green focus:ring-tm-green"
                          disabled={loading}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>ایمیل *</td>
                      <td>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full border-gray-300 focus:border-tm-green focus:ring-tm-green"
                          disabled={loading}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>نام نمایشی</td>
                      <td>
                        <Input
                          placeholder="نام نمایشی (اختیاری)"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          className="w-full border-gray-300 focus:border-tm-green focus:ring-tm-green"
                          disabled={loading}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>رمز عبور *</td>
                      <td>
                        <Input
                          type="password"
                          placeholder="حداقل ۶ کاراکتر"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                          className="w-full border-gray-300 focus:border-tm-green focus:ring-tm-green"
                          disabled={loading}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>تکرار رمز عبور *</td>
                      <td>
                        <Input
                          type="password"
                          placeholder="رمز عبور را دوباره وارد کن"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                          className="w-full border-gray-300 focus:border-tm-green focus:ring-tm-green"
                          disabled={loading}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Button
                type="submit"
                className="w-full bg-tm-green hover:bg-tm-green/90 text-white font-semibold py-3 rounded-md tm-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></span>
                    در حال ثبت‌نام...
                  </span>
                ) : (
                  'ثبت‌نام'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                قبلاً ثبت‌نام کردی؟{' '}
                <Link href="/login" className="text-tm-green hover:text-tm-green/80 underline font-medium transition-colors">
                  وارد شو
                </Link>
              </p>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-tm-green transition-colors inline-block"
              >
                ← بازگشت به خانه
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

