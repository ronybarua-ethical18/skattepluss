'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import { useTranslation } from '@/lib/TranslationProvider';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { handleSubmit, control, reset } = useForm<FormData>();
  const { translate } = useTranslation();

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session.user.role &&
      !session?.user.hasAnswers
    ) {
      router.push(`/onboard`);
    } else if (
      status === 'authenticated' &&
      session.user.role &&
      session?.user.hasAnswers
    ) {
      router.push(`/${session?.user.role}/dashboard`);
    }
  }, [session, router, status]);

  const mutation = trpc.auth.signup.useMutation({
    onSuccess: () => {
      toast.success(translate('page.signup.verification_email_sent'), {
        duration: 4000,
      });
      reset();
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message || translate('page.signup.error_message'));
      setLoading(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    setLoading(true);
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col space-y-8 items-center text-black justify-center h-screen bg-gray-100">
      <CompanyLogo color="#5B52F9" height="32" width="152" />

      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {translate('page.signup.title')}
          </h2>
          <p className="text-sm">{translate('page.signup.subtitle')}</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex space-x-2">
            <FormInput
              name="firstName"
              control={control}
              type="text"
              placeholder={translate('page.signup.first_name')}
              required
            />
            <FormInput
              name="lastName"
              control={control}
              type="text"
              placeholder={translate('page.signup.last_name')}
              required
            />
          </div>

          <FormInput
            name="email"
            control={control}
            type="email"
            placeholder={translate('page.signup.email')}
            required
          />

          <FormInput
            name="password"
            control={control}
            type="password"
            placeholder={translate('page.signup.password')}
            required
          />
          <small className="text-left text-gray-500">
            Password must be at least 6 characters long
          </small>
          {/* <FormInput
            name="role"
            control={control}
            type="select"
            placeholder="Select Role"
            options={[
              { title: 'Auditor', value: 'auditor' },
              { title: 'Customer', value: 'customer' },
            ]}
            required
          /> */}

          <Button
            type="submit"
            className="w-full text-white"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {translate('page.signup.sign_up')}
          </Button>
        </form>

        <div className="flex items-center justify-between">
          <span className="border-t w-full inline-block"></span>
          <span className="px-4 min-w-[200px] text-gray-500">
            {translate('page.signup.or_continue_with')}
          </span>
          <span className="border-t w-full inline-block"></span>
        </div>

        <Button
          variant="outline"
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center"
        >
          <FcGoogle className="text-lg" />
          <span className="flex-1 text-center ms-[-16px] text-[#1B1B28] font-medium">
            {translate('page.signup.google')}
          </span>
        </Button>

        <p className="text-sm text-[#71717A] font-medium">
          {translate('page.signup.already_have_account')}{' '}
          <Link href="/login" className="text-[#00104B]">
            {translate('page.signup.sign_in')}
          </Link>
        </p>
      </div>
    </div>
  );
}
