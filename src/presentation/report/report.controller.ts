import type { Request, Response } from "express";
import { ReportService } from "../../application/services/ReportService.js";

export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    getCourseReport = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.reportService.generateCourseReport(courseId!) //======================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getStudentProgressReport = async (req: Request, res: Response) => {
        const { studentId, courseId } = req.params;

        this.reportService.generateStudentProgressReport(studentId!, courseId!) //====================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };
}