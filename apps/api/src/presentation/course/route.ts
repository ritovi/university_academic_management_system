import { Router } from "express";
import { CourseController } from "./course.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class CourseRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const courseController = new CourseController(
            container.courseService,
            container.courseContentService
        );
        const authMiddleware = new AuthMiddleware();

        // Course management
        routes.post("/", 
            authMiddleware.authenticate, 
            authMiddleware.authorize("admin", "secretary"), 
            courseController.createCourse
        );
        routes.get("/", authMiddleware.authenticate, courseController.getAllCourses);
        routes.get("/professor/my-courses", authMiddleware.authenticate, authMiddleware.authorize("professor"), courseController.getProfessorCourses);
        routes.get("/:id", authMiddleware.authenticate, courseController.getCourse);
        
        // Syllabus
        routes.post("/syllabus", authMiddleware.authenticate, authMiddleware.authorize("professor"), courseController.uploadSyllabus);
        
        // Course content
        routes.post("/content", authMiddleware.authenticate, authMiddleware.authorize("professor"), courseController.uploadCourseContent);
        routes.get("/:courseId/content", authMiddleware.authenticate, courseController.getCourseContent);
        
        // Weight configuration
        routes.put("/:courseId/weights", authMiddleware.authenticate, authMiddleware.authorize("secretary"), courseController.updateCourseWeights);

        return routes;
    }
}