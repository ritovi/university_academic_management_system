import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class ReportRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const reportController = new ReportController(container.reportService);
        const authMiddleware = new AuthMiddleware();

        routes.get("/course/:courseId", authMiddleware.authenticate, authMiddleware.authorize("professor", "admin", "secretary"), reportController.getCourseReport);
        routes.get("/student/:studentId/course/:courseId", authMiddleware.authenticate, reportController.getStudentProgressReport);

        return routes;
    }
}