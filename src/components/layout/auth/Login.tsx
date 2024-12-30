'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import { useTranslation } from '@/lib/TranslationProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { translate } = useTranslation();

  // Simplified routing logic - removed useCallback as it's not needed here
  const getTargetRoute = (role: string, hasAnswers: boolean) => {
    console.log('role and hasAnswers from login', role, hasAnswers);
    if (role) {
      if (role === 'customer') {
        return hasAnswers ? '/customer/dashboard' : '/onboard';
      }
      return role === 'auditor' ? '/auditor/dashboard' : `/${role}/dashboard`;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error, { duration: 4000 });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error}`, { duration: 4000 });
      setIsSubmitting(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    signIn('google');
  };

  // Navigation effect
  useEffect(() => {
    // Only proceed if we have an authenticated session
    if (status === 'authenticated' && session?.user) {
      const { role, hasAnswers } = session.user;

      const targetRoute = getTargetRoute(role, hasAnswers);

      if (role && targetRoute) {
        // Add a small delay to ensure session is properly synced
        const timer = setTimeout(() => {
          router.replace(targetRoute); // Use replace instead of push
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [session, status, router]);

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && session?.user)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
  }

  console.log('session from lo gin', session);

  return (
    <div className="flex flex-col space-y-8 items-center text-black justify-center h-screen bg-gray-100">
      <CompanyLogo color="#5B52F9" height="32" width="152" />
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-[28px] font-semibold">
            {translate('page.login.welcome_back')}
          </h2>
          <p className="text-sm">
            {translate('page.login.log_in_to_continue')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              {translate('page.login.email')}
            </label>
            <Input
              type="email"
              id="email"
              placeholder={translate('page.login.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              {translate('page.login.password')}
            </label>
            <Input
              type="password"
              id="password"
              placeholder={translate('page.login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {translate('page.login.sign_in')}
          </Button>
        </form>

        <div className="flex justify-between text-[#71717A]">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-sm font-medium">
              {translate('page.login.remember_me')}
            </label>
          </div>
          <p className="text-sm font-medium">
            <Link href="/forgot-password" className="text-[#00104B]">
              {translate('page.login.forgot_password')}
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="border-t w-full inline-block"></span>
          <span className="px-4 min-w-[200px] text-gray-500">
            {translate('page.login.continue_with')}
          </span>
          <span className="border-t w-full inline-block"></span>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center"
        >
          <FcGoogle className="text-lg" />
          <span className="flex-1 text-center ms-[-16px] text-[#1B1B28] font-medium">
            {translate('page.login.google')}
          </span>
        </Button>
        <p className="text-sm text-[#71717A] font-medium">
          {translate('page.login.no_account')}{' '}
          <Link href="/signup" className="text-[#00104B]">
            {translate('page.login.sign_up')}
          </Link>
        </p>
      </div>
    </div>
  );
}
