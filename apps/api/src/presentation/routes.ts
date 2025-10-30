import { Router } from "express";
import { AuthRoutes } from "./auth/route.js";
import { StudentRoutes } from "./student/route.js";
import { ProfessorRoutes } from "./professor/route.js";
import { CourseRoutes } from "./course/route.js";
import { AttendanceRoutes } from "./attendance/route.js";
import { GradeRoutes } from "./grade/route.js";
import { EnrollmentRoutes } from "./enrollment/route.js";
import { LabRoutes } from "./lab/route.js";
import { ReportRoutes } from "./report/route.js";

export class AppRoutes {
    static getRoutes() {
        const routes = Router();
        
        routes.use("/api/auth", AuthRoutes.getRoutes());
        routes.use("/api/students", StudentRoutes.getRoutes());
        routes.use("/api/professors", ProfessorRoutes.getRoutes());
        routes.use("/api/courses", CourseRoutes.getRoutes());
        routes.use("/api/attendance", AttendanceRoutes.getRoutes());
        routes.use("/api/grades", GradeRoutes.getRoutes());
        routes.use("/api/enrollments", EnrollmentRoutes.getRoutes());
        routes.use("/api/labs", LabRoutes.getRoutes());
        routes.use("/api/reports", ReportRoutes.getRoutes());
        
        return routes;
    }
}