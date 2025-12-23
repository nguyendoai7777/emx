import { CastString, ControlFieldKind } from '@emx/types';

export const StyleMapped: Record<CastString<ControlFieldKind>, string> = {
  '': `border-gray-500 has-[:focus-visible]:border-gray-400 hover:border-gray-400`,
  error: `border-red-500 has-[:focus-visible]:border-red-400 hover:border-red-400`,
  warning: `border-orange-400 has-[:focus-visible]:border-orange-300 hover:border-orange-300`,
};
