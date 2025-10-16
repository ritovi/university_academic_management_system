import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class AuthRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const authController = new AuthController(container.authService);
        const authMiddleware = new AuthMiddleware();

        routes.post("/login", authController.login);
        routes.get("/profile", authMiddleware.authenticate, authController.getProfile);

        return routes;
    }
}