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
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'BentoAPIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class BentoConfigError extends BentoError {
  constructor(message: string) {
    super(message);
    this.name = 'BentoConfigError';
  }
}
