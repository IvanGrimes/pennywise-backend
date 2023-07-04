import { ExceptionBase } from '@lib/exceptions';

export class VerificationTokenExpiredError extends ExceptionBase {
  static readonly message = 'Email verification token expired';

  public readonly code = 'EMAIL_VERIFICATION.TOKEN_EXPIRED';

  constructor(cause?: Error, metadata?: unknown) {
    super(VerificationTokenExpiredError.message, cause, metadata);
  }
}

export class BadVerificationTokenError extends ExceptionBase {
  static readonly message = 'Bad email verification token';

  public readonly code = 'EMAIL_VERIFICATION.BAD_TOKEN';

  constructor(cause?: Error, metadata?: unknown) {
    super(BadVerificationTokenError.message, cause, metadata);
  }
}

export class EmailAlreadyVerifiedError extends ExceptionBase {
  static readonly message = 'Email already verified';

  public readonly code = 'EMAIL_VERIFICATION.ALREADY_VERIFIED';

  constructor(cause?: Error, metadata?: unknown) {
    super(EmailAlreadyVerifiedError.message, cause, metadata);
  }
}
