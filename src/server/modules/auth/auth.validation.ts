import { z } from 'zod'; // Import Zod for validation

const signupSchema = z.object({
  email: z.string().email(), // Validate email format
  password: z.string().min(6), // Validate password length
  firstName: z.string().min(1), // Validate first name
  lastName: z.string().min(1), // Validate last name
  /*   role: z.string(),
   */
});
export const authValidation = { signupSchema };
