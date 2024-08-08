import { Request, Response, NextFunction} from "express";

export default function notFound(req: Request, res: Response, next: NextFunction){
    res.status(404).json({
        error: 'ENDPOINT no encontrado',
        endpoints_disponibles: {
            articulos: `/articulos`,
        }
    });
}