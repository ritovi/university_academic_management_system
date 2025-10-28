import type { Request, Response } from "express";
import { AttendanceService } from "../../application/services/AttendanceService.js";
import { BulkMarkAttendanceDTO } from "../../application/dtos/AttendanceDTO.js";
import { IPService } from "../../infrastructure/other/IPService.js";

export class AttendanceController {
    constructor(
        private readonly attendanceService: AttendanceService,
        private readonly ipService: IPService
    ) {}

    markAttendance = async (req: Request, res: Response) => {
        const [error, dto] = BulkMarkAttendanceDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        const professorId = req.user!.id; //=========================================================

       
        const ipAddress = this.ipService.extractIPAddress(req);  

      
        const classMode = this.ipService.determineClassMode(ipAddress);   // Determine class mode based on IP


        this.attendanceService.markBulkAttendance(dto!, professorId, ipAddress, classMode) //======================================================
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    markAllAbsent = async (req: Request, res: Response) => {
        const { courseId, labGroupId, classDate, classType, weekNumber } = req.body;

        if (!courseId || !classDate || !classType || weekNumber === undefined) { //=====================================================================
            return res.status(422).json({ message: "Missing required fields" });
        }

        const professorId = req.user!.id;
        const date = new Date(classDate);

        // Extract IP address
        const ipAddress = this.ipService.extractIPAddress(req);
        const classMode = this.ipService.determineClassMode(ipAddress);

        this.attendanceService.markAllAbsent(courseId, labGroupId || null, date, classType, weekNumber, professorId, ipAddress, classMode)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getStudentAttendance = async (req: Request, res: Response) => {
        const { studentId, courseId } = req.params;

        this.attendanceService.getStudentAttendance(studentId!, courseId!) //========================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getCourseAttendanceReport = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.attendanceService.getCourseAttendanceReport(courseId!) //===========================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };
}