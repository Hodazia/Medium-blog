import { Request,Response } from "express";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        //@ts-ignore
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //@ts-ignore
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
};
