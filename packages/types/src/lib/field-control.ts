import { FieldSize } from './size.js';
import { CastString } from './type.js';

export interface ControlFieldProps {
  size: FieldSize;
  color: string;
}

export type ControlFieldState = 'error' | 'warning' | 'normal'