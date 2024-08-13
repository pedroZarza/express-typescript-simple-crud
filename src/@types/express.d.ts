// import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Express } from "express-serve-static-core";


declare module "express-serve-static-core" {
  interface Request {
    decodedPayload?: string | JwtPayload | undefined;
  }
}


// Extender la interfaz Request para incluir la propiedad user
// export{};
// declare global {
//   namespace Express {
//     interface Request {
//       decodedPayload?:  string | JwtPayload | undefined;
//     }
//   }
// }