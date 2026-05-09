import { z } from 'zod';
import type { MonthRecord } from '../types';

const itemSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

const nasdaqMetaSchema = z.object({
  보유: z.number(),
  수익: z.number(),
  공제: z.boolean(),
});

const monthRecordSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'month must be YYYY-MM'),
  reportedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  income: z.array(itemSchema),
  expense: z.array(itemSchema),
  assets: z.object({
    cash: z.array(itemSchema),
    investment: z.array(itemSchema),
  }),
  notes: z.string(),
  _meta: z
    .object({
      나스닥: nasdaqMetaSchema.optional(),
    })
    .optional(),
});

const monthsSchema = z.array(monthRecordSchema);

export function parseMonths(raw: unknown): MonthRecord[] {
  const parsed = monthsSchema.parse(raw);
  return [...parsed].sort((a, b) => a.month.localeCompare(b.month));
}
