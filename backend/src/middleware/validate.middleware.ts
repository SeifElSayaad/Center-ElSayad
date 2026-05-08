import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

/**
 * Express middleware factory that validates `req.body` against a Zod schema.
 * On failure it responds with 400 and a structured error list.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const zodError = result.error as ZodError;
      const errors = zodError.issues.map((e: ZodIssue) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }
    // Replace body with parsed + typed data (strips unknown fields)
    req.body = result.data;
    next();
  };
}
