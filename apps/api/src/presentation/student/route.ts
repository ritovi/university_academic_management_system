import { Router } from "express";
import { StudentController } from "./student.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class StudentRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const studentController = new StudentController(container.userService);
        const authMiddleware = new AuthMiddleware();

        routes.post("/", 
            authMiddleware.authenticate, 
            authMiddleware.authorize("admin", "secretary"), 
            studentController.createStudent
        );
        routes.get("/", authMiddleware.authenticate, studentController.getStudents);
        routes.get("/:id", authMiddleware.authenticate, studentController.getStudent);
        routes.delete("/:id", 
            authMiddleware.authenticate, 
            authMiddleware.authorize("admin"), 
            studentController.deleteStudent
        );
        routes.patch("/:id/status", 
            authMiddleware.authenticate, 
            authMiddleware.authorize("admin"), 
            studentController.updateStudentStatus
        );

        return routes;
    }
}