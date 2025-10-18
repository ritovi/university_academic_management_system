import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class EnrollmentRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const enrollmentController = new EnrollmentController(container.enrollmentService);
        const authMiddleware = new AuthMiddleware();

        routes.post("/", authMiddleware.authenticate, authMiddleware.authorize("secretary"), enrollmentController.createEnrollment);
        routes.post("/bulk", authMiddleware.authenticate, authMiddleware.authorize("secretary"), enrollmentController.bulkEnrollment);
        routes.get("/student/:studentId", authMiddleware.authenticate, enrollmentController.getStudentEnrollments);
        routes.get("/course/:courseId", authMiddleware.authenticate, enrollmentController.getCourseEnrollments);

        return routes;
    }
}