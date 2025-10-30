import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StudentEntity } from "./student.model.js";
import { CourseEntity } from "./CourseEntity.js";
import { LabGroupEntity } from "./LabGroupEntity.js";
import { UserEntity } from "./UserEntity.js";

export enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused"
}

export enum ClassType {
    THEORY = "theory",
    LAB = "lab"
}

export enum ClassMode {
    IN_PERSON = "in_person",
    REMOTE = "remote",
    HYBRID = "hybrid"
}

@Entity("attendances")
export class AttendanceEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    studentId: string;

    @ManyToOne(() => StudentEntity)
    @JoinColumn({ name: "studentId" })
    student: StudentEntity;

    @Column("uuid")
    courseId: string;

    @ManyToOne(() => CourseEntity)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity;

    @Column("uuid", { nullable: true })
    labGroupId: string | undefined;

    @ManyToOne(() => LabGroupEntity, { nullable: true })
    @JoinColumn({ name: "labGroupId" })
    labGroup: LabGroupEntity ;

    @Column("date")
    classDate: Date;

    @Column({ type: "enum", enum: ClassType })
    classType: ClassType;

    @Column({ type: "enum", enum: AttendanceStatus })
    status: AttendanceStatus;

    @Column("uuid")
    markedBy: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "markedBy" })
    professor: UserEntity;

    @Column("timestamp")
    markedAt: Date;

    @Column("int")
    weekNumber: number;

    @Column("varchar", { length: 45 })
    professorIpAddress: string;

    @Column({ type: "enum", enum: ClassMode })
    classMode: ClassMode;

    @Column("text", { nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;
}