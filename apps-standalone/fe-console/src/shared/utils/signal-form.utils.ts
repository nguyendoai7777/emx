import {
  customError,
  CustomValidationError,
  FieldState,
  FieldTree,
  FieldValidator,
  form,
  FormOptions,
  MaybeFieldTree,
  PathKind,
  SchemaOrSchemaFn,
  SchemaPath,
  validate,
  WithoutField,
} from '@angular/forms/signals';

import { WritableSignal } from '@angular/core';
import { CastString, ControlFieldKind } from '@emx/types';

type FieldNodeLike = {
  structure?: {
    children?(): Iterable<any>;
  };
  markAsTouched?(): void;
  markAsDirty?(): void;
};

export const markAllAsTouched = <T>(field: FieldTree<T> | FieldState<any>) => {
  const state = (typeof field === 'function' ? field() : field) as unknown as FieldNodeLike;

  // Mark current field as touched
  if (state?.markAsTouched) {
    state.markAsTouched();
  }

  // Recursively mark children if they exist
  if (state?.structure?.children) {
    for (const child of state.structure.children()) {
      markAllAsTouched(child as any);
    }
  }
};

export const markAllAsDirty = <T>(field: FieldTree<T> | FieldState<any>) => {
  const state = (typeof field === 'function' ? field() : field) as unknown as FieldNodeLike;

  // Mark current field as dirty
  if (state?.markAsDirty) {
    state.markAsDirty();
  }

  // Recursively mark children if they exist
  if (state?.structure?.children) {
    for (const child of state.structure.children()) {
      markAllAsDirty(child as any);
    }
  }
};

export const fieldError = <TValue>(field: MaybeFieldTree<TValue>) => {
  return (field?.().touched() || field?.().dirty()) && field?.().invalid() ? 'error' : '';
};

// Cast-Type definition matching all overloads of the form() function
type CreateFormFn = {
  <TModel>(model: WritableSignal<TModel>): FieldTree<TModel>;
  <TModel>(model: WritableSignal<TModel>, schemaOrOptions: SchemaOrSchemaFn<TModel> | FormOptions): FieldTree<TModel>;
  <TModel>(model: WritableSignal<TModel>, schema: SchemaOrSchemaFn<TModel>, options: FormOptions): FieldTree<TModel>;
};

export const createForm: CreateFormFn = form;

type CreateFieldValidatorFn = <T, K extends PathKind>(
  field: SchemaPath<T, 1, K>,
  validateFn: FieldValidator<T, K>
) => void;

export const createFieldValidator: CreateFieldValidatorFn = validate;

interface ValidationError {
  /** Identifies the kind of error. */
  readonly kind: CastString<ControlFieldKind>;
  /** Human readable error message. */
  readonly message?: string;
}

type CreateFCustomErrorFn = <E extends ValidationError>(obj?: E) => WithoutField<CustomValidationError>;

export const createCustomError: CreateFCustomErrorFn = customError;
