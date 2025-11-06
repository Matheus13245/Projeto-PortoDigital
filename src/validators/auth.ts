import { z } from "zod";

/** Login */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z.string().min(6, "Mínimo de 6 caracteres."),
});
export type LoginForm = z.infer<typeof loginSchema>;

/** Sign Up (US03) */
export const signUpSchema = z
  .object({
    name: z.string().trim().min(3, "Informe seu nome completo."),
    email: z.string().trim().toLowerCase().email("E-mail inválido."),
    password: z.string().min(6, "Mínimo de 6 caracteres."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Senhas não coincidem.",
  });

export type SignUpForm = z.infer<typeof signUpSchema>;



