import { z, ZodError } from "zod";

export const calendarSchema = z.object({
    local: z.string().min(3).max(255).refine(data => !!data, { message: 'The local is mandatory' }),
    date: z.string().refine(data => !!data, { message: 'Invalid or missing date' }),
    places: z.number().int().positive().refine(data => !!data, { message: 'The places is mandatory' }),
    status: z.string().optional(),
    observation: z.string().optional(),
    responsible: z.string().min(1).refine(data => !!data, { message: 'The responsible is mandatory' }),
    vaccine: z.string().refine(data => !!data, { message: 'The vaccine is mandatory' }),
    latitude: z.number().refine(data => !!data, { message: 'The latitude is mandatory' }),
    longitude: z.number().refine(data => !!data, { message: 'The longitude is mandatory' }),
  });