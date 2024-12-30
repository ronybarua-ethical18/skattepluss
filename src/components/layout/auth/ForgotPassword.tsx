'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CompanyLogo from '@/components/CompanyLogo';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { FormInput } from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      toast.success(
        'Password reset link has been sent to your email. Please check.',
        {
          duration: 4000,
        }
      );
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 4000,
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="mb-6">
        <CompanyLogo color="#5B52F9" height="32" width="152" />
      </div>

      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="block mb-2 text-[#101010] text-xs font-medium">
              Email Address
            </Label>
            <FormInput
              name="email"
              control={control}
              type="text"
              placeholder="Email address"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white"
            variant="purple"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
