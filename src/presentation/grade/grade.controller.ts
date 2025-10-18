import type { Request, Response } from "express";
import { GradeService } from "../../application/services/GradeService.js";
import { EnterGradeDTO } from "../../application/dtos/GradeDTO.js";

export class GradeController {
    constructor(private readonly gradeService: GradeService) {}

    enterGrade = async (req: Request, res: Response) => {
        const [error, dto] = EnterGradeDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        const professorId = req.user!.id;

        this.gradeService.enterGrade(dto!, professorId)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getStudentGrades = async (req: Request, res: Response) => {
        const { studentId, courseId } = req.params;

        this.gradeService.getStudentGrades(studentId!, courseId!) //============================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getCourseGradesReport = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.gradeService.getCourseGradesReport(courseId !) //=================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getGradeStatistics = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.gradeService.getGradeStatistics(courseId!) //====================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };
}