import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '@leaklens/shared';

/**
 * Reusable Express request payload validator using Zod schemas
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.slice(1).join('.'), // Remove "body" or "query" from the error path
          message: err.message,
        }));
        return next(new BadRequestError('Request validation failed.', formattedErrors));
      }
      return next(error);
    }
  };
};
export default validate;
