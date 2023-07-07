import { ExceptionBase } from '@lib/exceptions';

export class WrongCredentialsError extends ExceptionBase {
  static readonly message = 'Wrong credentials';

  public readonly code = 'AUTH.WRONG_CREDENTIALS';

  constructor(cause?: Error, metadata?: unknown) {
    super(WrongCredentialsError.message, cause, metadata);
  }
}

export class WrongRefreshTokenError extends ExceptionBase {
  static readonly message = 'Wrong refresh token';

  public readonly code = 'AUTH.WRONG_REFRESH_TOKEN';

  constructor(cause?: Error, metadata?: unknown) {
    super(WrongRefreshTokenError.message, cause, metadata);
  }
}
