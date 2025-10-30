import { Router } from "express";
import { GradeController } from "./grade.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class GradeRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const gradeController = new GradeController(container.gradeService);
        const authMiddleware = new AuthMiddleware();

        // Enter grades
        routes.post("/", authMiddleware.authenticate, authMiddleware.authorize("professor"), gradeController.enterGrade);
        
        // View grades
        routes.get("/student/:studentId/course/:courseId", authMiddleware.authenticate, gradeController.getStudentGrades);
        routes.get("/course/:courseId/report", authMiddleware.authenticate, authMiddleware.authorize("professor", "admin", "secretary"), gradeController.getCourseGradesReport);
        routes.get("/course/:courseId/statistics", authMiddleware.authenticate, authMiddleware.authorize("professor", "admin", "secretary"), gradeController.getGradeStatistics);

        return routes;
    }
}