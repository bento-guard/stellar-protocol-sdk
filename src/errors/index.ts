export * from './constants';

export class BentoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BentoError';
  }
}

export class BentoAuthError extends BentoError {
  constructor(message: string = 'Authentication failed. Please check your credentials.') {
    super(message);
    this.name = 'BentoAuthError';
  }
}

export class BentoAPIError extends BentoError {
  public statusCode?: number;
  public response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = 'BentoAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class BentoConfigError extends BentoError {
  constructor(message: string) {
    super(message);
    this.name = 'BentoConfigError';
  }
}

export function isBentoError(error: unknown): error is BentoError {
  return error instanceof BentoError;
}
