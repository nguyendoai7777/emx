import type { CreateSignalOptions, WritableSignal } from '@angular/core';
import { RootFieldContext, SchemaPath } from '@angular/forms/signals';

declare module '@angular/core' {
  interface CreateSignal {
    <T>(): WritableSignal<T | undefined>;

    <T>(value: T): WritableSignal<T>;

    <T>(value: T, options?: CreateSignalOptions<T>): WritableSignal<T>;
  }

  declare const signal: CreateSignal;
}
