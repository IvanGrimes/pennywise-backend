import { ExceptionBase } from '@lib/exceptions';

export class CategoryNotFoundError extends ExceptionBase {
  static readonly message = 'Category not found';

  public readonly code = 'CATEGORIES.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(CategoryNotFoundError.message, cause, metadata);
  }
}
