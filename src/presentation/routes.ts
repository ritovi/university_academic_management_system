import { Router } from "express";
import { AuthRoutes } from "./auth/route.js";
import { StudentRoutes } from "./student/route.js";
import { ProfessorRoutes } from "./professor/route.js";

export class AppRoutes {
    static getRoutes() {
        const routes = Router();
        
        routes.use("/api/auth", AuthRoutes.getRoutes());
        routes.use("/api/students", StudentRoutes.getRoutes());
        routes.use("/api/professors", ProfessorRoutes.getRoutes());
        
        return routes;
    }
}