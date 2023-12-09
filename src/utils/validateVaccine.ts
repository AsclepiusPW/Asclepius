import { z, ZodError } from 'zod';

export const vaccineSchema = z.object({
    name: z.string().min(3).max(255).refine(data => !!data, { message: 'The name is mandatory' }),
    type: z.string().min(3).max(255).refine(data => !!data, { message: 'The type is mandatory' }),
    manufacturer: z.string().min(3).max(255).refine(data => !!data, { message: 'The manufacturer is mandatory' }),
    description: z.string().min(3).refine(data => !!data, { message: 'The description is mandatory' }),
    contraIndication: z.string().min(3).refine(data => !!data, { message: 'The contraIndication is mandatory' }),
});