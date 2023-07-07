import { ExceptionBase } from '@lib/exceptions';

export class WrongCredentialsError extends ExceptionBase {
  static readonly message = 'Wrong credentials';

  public readonly code = 'AUTH.WRONG_CREDENTIALS';

  constructor(cause?: Error, metadata?: unknown) {
    super(WrongCredentialsError.message, cause, metadata);
  }
}

export class RefreshTokenNotFoundOrExpiredError extends ExceptionBase {
  static readonly message = 'Refresh token not found or expired';

  public readonly code = 'AUTH.REFRESH_TOKEN_NOT_FOUND_OR_EXPIRED';

  constructor(cause?: Error, metadata?: unknown) {
    super(RefreshTokenNotFoundOrExpiredError.message, cause, metadata);
  }
}

export class WrongRefreshTokenError extends ExceptionBase {
  static readonly message = 'Wrong refresh token';

  public readonly code = 'AUTH.WRONG_REFRESH_TOKEN';

  constructor(cause?: Error, metadata?: unknown) {
    super(WrongRefreshTokenError.message, cause, metadata);
  }
}
