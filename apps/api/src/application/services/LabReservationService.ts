import { Repository, Between } from "typeorm";
import { LabReservationEntity, ReservationStatus } from "../../infrastructure/postgres/entities/LabReservationEntity.js";
import { CreateLabReservationDTO } from "../dtos/LabReservationDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class LabReservationService {
    constructor(
        private readonly labReservationRepository: Repository<LabReservationEntity>
    ) {}

    async createReservation(dto: CreateLabReservationDTO, professorId: string) {
        // Check weekly limit (max 2 per week)
        const weekStart = this.getWeekStart(dto.reservationDate);
        const weekEnd = this.getWeekEnd(dto.reservationDate);

        const existingReservations = await this.labReservationRepository.count({
            where: {
                professorId,
                reservationDate: Between(weekStart, weekEnd),
                status: ReservationStatus.APPROVED
            }
        });

        if (existingReservations >= 2) {
            throw new AppError("Maximum 2 lab reservations per week allowed", 400);
        }

        const reservation = this.labReservationRepository.create({
            professorId,
            labGroupId: dto.labGroupId,
            reservationDate: dto.reservationDate,
            startTime: dto.startTime,
            endTime: dto.endTime,
            purpose: dto.purpose,
            weekNumber: dto.weekNumber,
            status: ReservationStatus.PENDING
        });

        return await this.labReservationRepository.save(reservation);
    }

    async getProfessorReservations(professorId: string) {
        return await this.labReservationRepository.find({
            where: { professorId },
            relations: ["labGroup", "labGroup.course"],
            order: { reservationDate: "DESC" }
        });
    }

    async getAllReservations() {
        return await this.labReservationRepository.find({
            relations: ["professor", "labGroup", "labGroup.course"],
            order: { reservationDate: "DESC" }
        });
    }

    async approveReservation(reservationId: string) {
        const reservation = await this.labReservationRepository.findOne({
            where: { id: reservationId }
        });

        if (!reservation) {
            throw new AppError("Reservation not found", 404);
        }

        reservation.status = ReservationStatus.APPROVED;
        return await this.labReservationRepository.save(reservation);
    }

    async rejectReservation(reservationId: string) {
        const reservation = await this.labReservationRepository.findOne({
            where: { id: reservationId }
        });

        if (!reservation) {
            throw new AppError("Reservation not found", 404);
        }

        reservation.status = ReservationStatus.REJECTED;
        return await this.labReservationRepository.save(reservation);
    }

    async cancelReservation(reservationId: string, professorId: string) {
        const reservation = await this.labReservationRepository.findOne({
            where: { id: reservationId }
        });

        if (!reservation) {
            throw new AppError("Reservation not found", 404);
        }

        if (reservation.professorId !== professorId) {
            throw new AppError("You can only cancel your own reservations", 403);
        }

        reservation.status = ReservationStatus.CANCELLED;
        return await this.labReservationRepository.save(reservation);
    }

    private getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    private getWeekEnd(date: Date): Date {
        const start = this.getWeekStart(date);
        return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    }
}