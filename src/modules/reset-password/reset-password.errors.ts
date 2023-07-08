import { ExceptionBase } from '@lib/exceptions';

export class ResetPasswordTokenExpiredError extends ExceptionBase {
  static readonly message = 'Reset password token expired';

  public readonly code = 'RESET_PASSWORD.TOKEN_EXPIRED';

  constructor(cause?: Error, metadata?: unknown) {
    super(ResetPasswordTokenExpiredError.message, cause, metadata);
  }
}

export class BadResetPasswordTokenError extends ExceptionBase {
  static readonly message = 'Bad reset password token';

  public readonly code = 'RESET_PASSWORD.BAD_TOKEN';

  constructor(cause?: Error, metadata?: unknown) {
    super(BadResetPasswordTokenError.message, cause, metadata);
  }
}

export class ResetPasswordTokenNotFoundError extends ExceptionBase {
  static readonly message = 'Reset password token not found';

  public readonly code = 'RESET_PASSWORD.TOKEN_NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ResetPasswordTokenNotFoundError.message, cause, metadata);
  }
}
