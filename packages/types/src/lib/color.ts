import { CastString } from './type.js';

 type _VariantColor = 'primary' | 'success' | 'error' | 'info' | 'warning';
export type VariantColor = CastString<'primary' | 'success' | 'error' | 'info' | 'warning'>;

