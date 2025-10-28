import { Router } from "express";
import { AttendanceController } from "./attendance.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class AttendanceRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const attendanceController = new AttendanceController(
            container.attendanceService,
            container.ipService
        );
        const authMiddleware = new AuthMiddleware();

        // Mark attendance
        routes.post("/", authMiddleware.authenticate, authMiddleware.authorize("professor"), attendanceController.markAttendance);
        routes.post("/mark-absent", authMiddleware.authenticate, authMiddleware.authorize("professor"), attendanceController.markAllAbsent);
        
        // View attendance
        routes.get("/student/:studentId/course/:courseId", authMiddleware.authenticate, attendanceController.getStudentAttendance);
        routes.get("/course/:courseId/report", authMiddleware.authenticate, authMiddleware.authorize("professor", "admin", "secretary"), attendanceController.getCourseAttendanceReport);

        return routes;
    }
}