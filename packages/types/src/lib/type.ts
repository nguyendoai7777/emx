export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type CastString<T> = T | (string & {});

export type Maybe = undefined | null;
