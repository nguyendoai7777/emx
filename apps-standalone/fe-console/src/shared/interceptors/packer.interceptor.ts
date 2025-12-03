import { HttpInterceptorFn } from '@angular/common/http';
import { USE_MSGPACK } from '@common/constants';

export const PackerInterceptor: HttpInterceptorFn = (req, next) => {
  const useMsgpack = req.context.get(USE_MSGPACK);

  if (!useMsgpack) {
    return next(req); // để nguyên JSON như cũ
  }

  // Bước 2: Clone request với body đã pack + header đúng
  const msgpackReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/x-msgpack',
      Accept: 'application/x-msgpack',
    },
  });

  // Bước 3: Xử lý response
  return next(msgpackReq);
};
