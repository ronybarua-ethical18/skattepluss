'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { trpc } from '@/utils/trpc';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { questionnaireSelector, showModal } from '@/redux/slices/questionnaire';

type AddAuditorFormData = {
  email: string;
  message?: string;
};

export default function AddAuditorModal() {
  const dispatch = useAppDispatch();
  const { isModalOpen } = useAppSelector(questionnaireSelector);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm<AddAuditorFormData>({
    defaultValues: {
      email: '',
      message: '',
    },
  });

  const utils = trpc.useUtils();
  const inviteMutation = trpc.auditor.inviteAuditor.useMutation({
    onSuccess: () => {
      toast.success('invitation sent successfully', { duration: 4000 });
      reset();
      utils.auditor.getAuditorsOrCustomers.invalidate();
      dispatch(showModal(false));
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Invitaion failed!');
      setLoading(false);
    },
  });
  const onSubmit = (data: AddAuditorFormData) => {
    const { email, message } = data;
    inviteMutation.mutate({ auditor_email: email, message });
    setLoading(true);
  };
  const handleTrigger = () => {
    dispatch(showModal(!isModalOpen));
  };
  return (
    <>
      <Button variant="purple" onClick={handleTrigger}>
        <Plus className="h-4 w-4 mr-2" /> Add Auditor
      </Button>

      <SharedModal open={isModalOpen} onOpenChange={handleTrigger}>
        <h2 className="text-lg font-medium  mb-4">Add Auditor</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <FormInput
              name="email"
              control={control}
              placeholder="Enter auditor's email"
              type="email"
              required
              customClassName="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <FormInput
              name="message"
              control={control}
              placeholder="Add a message..."
              type="textarea"
              customClassName="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center text-white"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Send
            Invite
          </Button>
        </form>
      </SharedModal>
    </>
  );
}
