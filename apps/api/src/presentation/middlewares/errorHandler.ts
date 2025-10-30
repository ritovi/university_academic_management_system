import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError.js";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            status: "error"
        });
    }

    console.error("Unexpected error:", error);

    return res.status(500).json({
        message: "Internal server error",
        status: "error"
    });
};