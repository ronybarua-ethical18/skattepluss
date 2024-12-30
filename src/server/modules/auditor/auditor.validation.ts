import { z } from 'zod';

const auditorSchema = z.object({
  auditor_email: z.string({
    required_error: 'Auditor Email is required',
  }),
  message: z.string({}).optional(),
});
const updateAuditorSchema = z.object({
  status: z.enum(['invited', 'verified']).optional(),
});
const verifyAuditorSchema = z.object({
  token: z.string({
    required_error: 'Token is required to verify auditor',
  }),
  firstName: z.string({
    required_error: 'First name is required',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export const auditorValidation = {
  auditorSchema,
  updateAuditorSchema,
  verifyAuditorSchema,
};
