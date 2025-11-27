export const EResMessage = {
  Success: 'Success',
  LoginSuccess: 'Đăng nhập thành công',
} as const;

export type ResponseMessage = keyof typeof EResMessage;
