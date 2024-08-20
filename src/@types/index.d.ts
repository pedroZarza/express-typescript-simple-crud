import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type Payload = string | JwtPayload | undefined;


declare global {
  namespace Express {
    interface Request {
      payload?: Payload,
    }
  }
}