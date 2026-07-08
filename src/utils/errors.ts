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
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'BentoAPIError';
    this.statusCode = statusCode;
  }
}
