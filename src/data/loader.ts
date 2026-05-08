import raw from './months.json';
import { parseMonths } from '../lib/schema';

export const months = parseMonths(raw);
