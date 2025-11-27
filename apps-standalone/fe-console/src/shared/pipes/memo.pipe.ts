import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fn',
})
export class MemoFnPipe implements PipeTransform {
  transform<TFunc extends (...args: any[]) => any, TResult extends ReturnType<TFunc>>(
    fn: TFunc,
    ...args: Parameters<TFunc>
  ): TResult {
    return fn(...args) as TResult;
  }
}
