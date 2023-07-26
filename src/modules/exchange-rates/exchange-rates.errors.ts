import { ExceptionBase } from '@lib/exceptions';

export class ExchangeRatesAreUnavailable extends ExceptionBase {
  static readonly message = 'Exchange rates are unavailable';

  public readonly code = 'EXCHANGE_RATES.UNAVAILABLE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ExchangeRatesAreUnavailable.message, cause, metadata);
  }
}
