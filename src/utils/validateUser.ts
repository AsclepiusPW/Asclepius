import { z, ZodError } from 'zod';

const validateTelefone = (telefone: string) => {
    const phoneValidate = /^(\+\d{1,2}\s?)?(\()?\d{2,4}(\))?\s?(\d{4,5}(-|\s)?\d{4})$/;
    const isValid = phoneValidate.test(telefone);
    return isValid;
}

export const userSchema = z.object({
    name: z.string().min(3).max(255).refine(data => !!data, { message: 'The name is mandatory' }),
    password: z.string().min(6).refine(data => !!data, { message: 'The password is mandatory' }),
    confirmPassword: z.string(),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
    telefone: z.string()
        .refine(data => !!data, { message: 'The telefone is mandatory' })
        .refine(data => validateTelefone(data), { message: 'Invalid telephone number' }),
    latitude: z.number().refine(data => !!data, { message: 'The latitude is mandatory' }),
    longitude: z.number().refine(data => !!data, { message: 'The longitude is mandatory' }),
});

export const authenticationSchema = z.object({
    name: z.string().min(3).max(255).refine(data => !!data, { message: 'The name is mandatory' }),
    password: z.string().min(6).refine(data => !!data, { message: 'The password is mandatory' }),
    confirmPassword: z.string(),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
});