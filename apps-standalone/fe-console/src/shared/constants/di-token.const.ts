import { HttpContext, HttpContextToken } from '@angular/common/http';

export const USE_MSGPACK = new HttpContextToken<boolean>(() => false);

export const useMsgPackr = () => new HttpContext().set(USE_MSGPACK, true);
