import type { Request, Response, NextFunction } from "express";
import { JWTService } from "../../infrastructure/other/JWTService.js";
import { AppError } from "../../shared/errors/AppError.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

export class AuthMiddleware {
    private jwtService: JWTService;

    constructor() {
        this.jwtService = new JWTService();
    }

    authenticate = (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw new AppError("No token provided", 401);
            }

            const parts = authHeader.split(" ");

            if (parts.length !== 2 || parts[0] !== "Bearer") {
                throw new AppError("Invalid token format", 401);
            }

            const token = parts[1];
            const decoded = this.jwtService.verifyToken(token!);  //===========================================================================================//

            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
    };

    authorize = (...roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        };
    };
}