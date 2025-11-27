import { FieldState, FieldTree, form, MaybeFieldTree } from '@angular/forms/signals';

export const markAllAsTouched = <T, R extends FieldTree<T> | FieldState<any>>(container: R) => {
  Object.values(container).forEach((accessor: unknown) => {
    if (typeof accessor === 'function') {
      const control = (accessor as () => FieldState<any>)();
      if (control && typeof control.markAsTouched === 'function') {
        control.markAsTouched();
      } else if (control && typeof control === 'object') {
        markAllAsTouched(control);
      }
    }
  });
};

export const markAllAsDirty = <T, R extends FieldTree<T> | FieldState<any>>(container: R) => {
  Object.values(container).forEach((accessor: unknown) => {
    if (typeof accessor === 'function') {
      const control = (accessor as () => FieldState<any>)();
      if (control && typeof control.markAsTouched === 'function') {
        control.markAsDirty();
      } else if (control && typeof control === 'object') {
        markAllAsDirty(control);
      }
    }
  });
};

export const fieldError = <TValue>(field: MaybeFieldTree<TValue>) => {
  return (field?.().touched() || field?.().dirty()) && field?.().invalid() ? 'error' : 'normal';
};

export const createForm = form;
