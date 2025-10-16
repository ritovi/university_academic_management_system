import { Router } from "express";
import { ProfessorController } from "./professor.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class ProfessorRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const professorController = new ProfessorController(container.userService);
        const authMiddleware = new AuthMiddleware();

        routes.post("/", 
            authMiddleware.authenticate, 
            authMiddleware.authorize("admin", "secretary"), 
            professorController.createProfessor
        );
        routes.get("/", authMiddleware.authenticate, professorController.getProfessors);
        routes.get("/:id", authMiddleware.authenticate, professorController.getProfessor);

        return routes;
    }
}