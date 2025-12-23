import { FieldSize } from './size.js';
import { CastString } from './type.js';

export interface ControlFieldProps {
  size: FieldSize;
  color: string;
}

/** @type {'error' | 'warning' | ''} */
export type ControlFieldKind = 'error' | 'warning' | '';
