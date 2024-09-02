import { z, ZodError } from 'zod';

const validateTelefone = (telefone: string) => {
    const phoneValidate = /^(\+\d{1,2}\s?)?(\()?\d{2,4}(\))?\s?(\d{4,5}(-|\s)?\d{4})$/;
    const isValid = phoneValidate.test(telefone);
    return isValid;
}

//Criação do usuário
export const userSchema = z.object({
    name: z.string().min(3).max(255).refine(data => !!data, { message: 'The name is mandatory' }),
    password: z.string().min(6).refine(data => !!data, { message: 'The password is mandatory' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
    telefone: z.string()
        .refine(data => !!data, { message: 'The telefone is mandatory' })
        .refine(data => validateTelefone(data), { message: 'Invalid telephone number' }),
    latitude: z.number().refine(data => !!data, { message: 'The latitude is mandatory' }),
    longitude: z.number().refine(data => !!data, { message: 'The longitude is mandatory' }),
});

//Edição do usuário
export const userUpdateSchema = z.object({
    name: z.string().min(3).max(255).refine(data => !!data, { message: 'The name is mandatory' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
    telefone: z.string()
        .refine(data => !!data, { message: 'The telefone is mandatory' })
        .refine(data => validateTelefone(data), { message: 'Invalid telephone number' }),
    latitude: z.number().refine(data => !!data, { message: 'The latitude is mandatory' }),
    longitude: z.number().refine(data => !!data, { message: 'The longitude is mandatory' }),
});

//Edição da senha de um usuário
export const userResetPasswordSchema = z.object({
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .refine(data => !!data, { message: 'The password is mandatory' }),
    confirmPassword: z.string()
        .min(6, { message: 'Confirm Password must be at least 6 characters long' })
        .refine(data => !!data, { message: 'The confirm password is mandatory' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Specify which field should display the error
});

//Validação de usuario
export const authenticationSchema = z.object({
    password: z.string().min(6).refine(data => !!data, { message: 'The password is mandatory' }),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
});

//Validação de administrador
export const authenticationSchemaAdmin = z.object({
    name: z.string().min(3).max(255).refine(data => !!data, { message: 'The name is mandatory' }),
    password: z.string().min(6).refine(data => !!data, { message: 'The password is mandatory' }),
    confirmPassword: z.string(),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(data => !!data, { message: 'The email is mandatory' }),
});