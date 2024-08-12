import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Extender la interfaz Request para incluir la propiedad user

declare global {
  namespace Express {
    interface Request {
      decodedPayload?:  string | JwtPayload | undefined; 
    }
  }
}