import type { Request, Response } from "express";
import { LabGroupService } from "../../application/services/LabGroupService.js";
import { LabReservationService } from "../../application/services/LabReservationService.js";
import { CreateLabReservationDTO } from "../../application/dtos/LabReservationDTO.js";

export class LabController {
    constructor(
        private readonly labGroupService: LabGroupService,
        private readonly labReservationService: LabReservationService
    ) {}

    createLabGroup = async (req: Request, res: Response) => {
        const { courseId, groupNumber, labProfessorId, schedule, capacity } = req.body;

        if (!courseId || !groupNumber || !labProfessorId || !schedule) {
            return res.status(422).json({ message: "Missing required fields" });
        }

        this.labGroupService.createLabGroup(courseId, groupNumber, labProfessorId, schedule, capacity || 20)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getLabGroupsByCourse = async (req: Request, res: Response) => {
        const { courseId } = req.params;

        this.labGroupService.getLabGroupsByCourse(courseId!) //==================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getProfessorLabGroups = async (req: Request, res: Response) => {
        const professorId = req.user!.id;

        this.labGroupService.getLabGroupsByProfessor(professorId)
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    createReservation = async (req: Request, res: Response) => {
        const [error, dto] = CreateLabReservationDTO.create(req.body);
        if (error) return res.status(422).json({ message: error });

        const professorId = req.user!.id;

        this.labReservationService.createReservation(dto!, professorId)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getProfessorReservations = async (req: Request, res: Response) => {
        const professorId = req.user!.id;

        this.labReservationService.getProfessorReservations(professorId)
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    getAllReservations = async (req: Request, res: Response) => {
        this.labReservationService.getAllReservations()
            .then((data) => res.status(200).json(data))
            .catch(() => res.status(500).json({ message: "Error fetching reservations" }));
    };

    approveReservation = async (req: Request, res: Response) => {
        const { reservationId } = req.params;

        this.labReservationService.approveReservation(reservationId!) //=========================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    rejectReservation = async (req: Request, res: Response) => {
        const { reservationId } = req.params;

        this.labReservationService.rejectReservation(reservationId!) //=============================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };

    cancelReservation = async (req: Request, res: Response) => {
        const { reservationId } = req.params;
        const professorId = req.user!.id;

        this.labReservationService.cancelReservation(reservationId!, professorId)//=====================================================
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ message: error.message || "Internal Server Error" });
            });
    };
}