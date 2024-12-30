'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import CompanyLogo from '@/components/CompanyLogo';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import toast from 'react-hot-toast';
import { trpc } from '@/utils/trpc';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { handleSubmit, control, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const mutation = trpc.auth.resetPassword.useMutation({
    onSuccess: (success) => {
      toast.success(success.message, {
        duration: 2000,
      });
      setIsSubmitting(false);
      router.push('/login');
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 4000,
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      if (!token) {
        toast.error('Reset token is missing');
        setIsSubmitting(false);
        return;
      }

      mutation.mutate({
        ...data,
        token,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !password || !confirmPassword || isSubmitting;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-6">
        <CompanyLogo color="#5B52F9" height="32" width="152" />
      </div>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="block mb-2 text-[#101010] text-xs font-medium">
              Create new password
            </Label>
            <FormInput
              name="password"
              control={control}
              type="password"
              placeholder="Create new password"
              required
            />
          </div>
          <div>
            <Label className="block mb-2 text-[#101010] text-xs font-medium">
              Confirm new password
            </Label>
            <FormInput
              name="confirmPassword"
              control={control}
              type="password"
              placeholder="Confirm new password"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full text-white"
            variant="purple"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
