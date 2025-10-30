import type { Request, Response } from "express";
import { CourseService } from "../../application/services/CourseService.js";
import { CourseContentService } from "../../application/services/CourseContentService.js";
import { CreateCourseDTO, UploadSyllabusDTO } from "../../application/dtos/CourseDTO.js";
import { BulkCreateCourseContentDTO } from "../../application/dtos/CourseContentDTO.js";

export class CourseController {
    constructor(
        private readonly courseService: CourseService,
        private readonly courseContentService: CourseContentService
    ) {}

    createCourse = async (req: Request, res: Response) => {
        const [error, dto] = CreateCourseDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        this.courseService.createCourse(dto!)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    uploadSyllabus = async (req: Request, res: Response) => {
        const [error, dto] = UploadSyllabusDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        const professorId = req.user!.id;

        this.courseService.uploadSyllabus(dto!, professorId)
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    uploadCourseContent = async (req: Request, res: Response) => {
        const [error, dto] = BulkCreateCourseContentDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        const professorId = req.user!.id;

        this.courseContentService.bulkCreateCourseContent(dto!, professorId)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getCourseContent = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.courseContentService.getCourseContent(courseId !) //===========================================================//
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getCourse = async (req: Request, res: Response) => {
        const { id } = req.params;

        this.courseService.getCourseById(id!) // =============================================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getAllCourses = async (req: Request, res: Response) => {
        this.courseService.getAllCourses()
            .then((data) => res.status(200).json(data))
            .catch(() => res.status(500).json({ message: "Error fetching courses" }));
    };

    getProfessorCourses = async (req: Request, res: Response) => {
        const professorId = req.user!.id;

        this.courseService.getCoursesByProfessor(professorId)
            .then((data) => res.status(200).json(data))
            .catch(() => res.status(500).json({ message: "Error fetching courses" }));
    };

    updateCourseWeights = async (req: Request, res: Response) => {
        const { courseId } = req.params;
        const { theoryWeight, labWeight } = req.body;

        if (!theoryWeight || !labWeight) {
            return res.status(422).json({ message: "Missing theoryWeight or labWeight" });
        }

        this.courseService.updateCourseWeights(courseId !, theoryWeight, labWeight) //====================================================================//
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };
}