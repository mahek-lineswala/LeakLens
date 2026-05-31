// API Standard Response Formatters
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: any[];
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];

  constructor(message: string, statusCode: number = 500, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', errors: any[] = []) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}

// Helpers
export const formatSuccess = <T>(message: string, data?: T): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const formatError = (message: string, errors: any[] = []): ApiErrorResponse => {
  return {
    success: false,
    message,
    errors,
  };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseAmount = (val: string | number): number => {
  if (typeof val === 'number') return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};
