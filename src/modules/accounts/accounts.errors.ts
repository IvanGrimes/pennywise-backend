import { ExceptionBase } from '@lib/exceptions';

export class AccountNotFoundError extends ExceptionBase {
  static readonly message = 'Account not found';

  public readonly code = 'ACCOUNTS.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(AccountNotFoundError.message, cause, metadata);
  }
}
