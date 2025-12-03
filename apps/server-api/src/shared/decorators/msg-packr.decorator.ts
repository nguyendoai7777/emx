import { UseInterceptors } from '@nestjs/common';
import { MsgPackInterceptor } from '@interceptors';

export function UseMsgPack() {
  return UseInterceptors(MsgPackInterceptor);
}
