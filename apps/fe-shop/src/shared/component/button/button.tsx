import { ControlFieldProps } from '@emx/types';

export interface ButtonProps extends ControlFieldProps {}

export const Button: FCC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>;
};

export default Button;
