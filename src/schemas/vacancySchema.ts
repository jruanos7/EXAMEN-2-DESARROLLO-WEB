// src/schemas/vacancySchema.ts
import { z } from 'zod';

export const vacancySchema = z.object({
  puesto: z
    .string({ error: 'El puesto es requerido' })
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),

  departamento: z.enum(
    ['Tecnología', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'],
    { error: 'Selecciona un departamento' }
  ),

  modalidad: z.enum(['presencial', 'remoto', 'híbrido'], {
    error: 'Selecciona una modalidad',
  }),

  salarioOfrecido: z.coerce
    .number({ error: 'El salario ofrecido es requerido' })
    .min(1, 'El salario debe ser mayor a 0')
    .max(999999, 'Salario fuera de rango'),

  fechaPublicacion: z
    .string({ error: 'La fecha de publicación es requerida' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

  estado: z.enum(['abierta', 'cerrada']).default('abierta'),

  candidatosPostulados: z.coerce
    .number({ error: 'La cantidad de candidatos es requerida' })
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
});

export type VacancyFormData = z.infer<typeof vacancySchema>;
export type VacancyFormInput = z.input<typeof vacancySchema>;