import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

class Middleware {
  handleValidationError(req: Request, res: Response, next: NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // added status code 400 to make it easy for frontend
      // can add status 200 and a success key or something else too
      return res.status(400).json(error.array()[0]);
    }
    next();
  }
}
export default new Middleware();
