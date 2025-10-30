import type { Request, Response } from "express";
import { AuthenticationService } from "../../application/services/AuthenticationService.js";
import { LoginDTO } from "../../application/dtos/LoginDTO.js";

export class AuthController {
    constructor(private readonly authService: AuthenticationService) {}

    login = async (req: Request, res: Response) => {
        const [error, dto] = LoginDTO.create(req.body);
        
        if (error) {
            return res.status(422).json({ message: error });
        }

        this.authService.login(dto!)
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ 
                    message: error.message || "Internal Server Error" 
                });
            });
    };

    getProfile = async (req: Request, res: Response) => {
        try {
            res.status(200).json({
                user: req.user
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}