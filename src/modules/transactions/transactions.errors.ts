import { ExceptionBase } from '@lib/exceptions';

export class TransactionNotFoundError extends ExceptionBase {
  static readonly message = 'Transaction not found';

  public readonly code = 'TRANSACTIONS.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(TransactionNotFoundError.message, cause, metadata);
  }
}
