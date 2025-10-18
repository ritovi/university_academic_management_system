import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";
import { LabGroupEntity } from "./LabGroupEntity.js";

export enum ReservationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

@Entity("lab_reservations")
export class LabReservationEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    professorId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "professorId" })
    professor: UserEntity;

    @Column("uuid")
    labGroupId: string;

    @ManyToOne(() => LabGroupEntity)
    @JoinColumn({ name: "labGroupId" })
    labGroup: LabGroupEntity;

    @Column("date")
    reservationDate: Date;

    @Column("varchar", { length: 10 })
    startTime: string;

    @Column("varchar", { length: 10 })
    endTime: string;

    @Column("text")
    purpose: string;

    @Column({ type: "enum", enum: ReservationStatus, default: ReservationStatus.PENDING })
    status: ReservationStatus;

    @Column("int")
    weekNumber: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}