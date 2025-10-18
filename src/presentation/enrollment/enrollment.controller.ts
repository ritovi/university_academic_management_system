import type { Request, Response } from "express";
import { EnrollmentService } from "../../application/services/EnrollmentService.js";
import { BulkEnrollmentDTO, CreateEnrollmentDTO } from "../../application/dtos/EnrollmentDTO.js";

export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}

    createEnrollment = async (req: Request, res: Response) => {
        const [error, dto] = CreateEnrollmentDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        this.enrollmentService.createEnrollment(dto!)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    bulkEnrollment = async (req: Request, res: Response) => {
        const [error, dto] = BulkEnrollmentDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        this.enrollmentService.bulkEnrollment(dto!)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getStudentEnrollments = async (req: Request, res: Response) => {
        const { studentId } = req.params;

        this.enrollmentService.getStudentEnrollments(studentId !) //===================================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getCourseEnrollments = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.enrollmentService.getCourseEnrollments(courseId !) //=======================================================================//
             .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };
}