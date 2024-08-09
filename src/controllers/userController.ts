import { Request, Response } from "express";
import { SimpleUser } from "../interfaces/user.interface";

export async function createOneUser(req: Request, res: Response): Promise< Response | undefined> {
    try {
        return res.send(req.body);
    } catch (error) {
        
    }
    
}