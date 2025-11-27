import { ReactElement, ReactNode, MouseEvent, KeyboardEvent, Context, RefObject } from 'react';

declare global {
  export type PropsWithChildren<P> = P & { children?: ReactNode; className?: string | undefined };

  export interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  }

  export type FCC<P = {}> = FunctionComponent<P>;

  export type RMouseEvent<T> = MouseEvent<T>;
  export type RKeyboardEvent<R> = KeyboardEvent<R>;

  // App
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
  function createContext<T>(defaultValue: T): Context<T>;
  function createContext<T = undefined>(): Context<T>;
  function useRef<T>(initialValue: T): RefObject<T>;
  function useRef<T = undefined>(): RefObject<T>;
}
