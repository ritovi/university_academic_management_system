import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StudentEntity } from "./student.model.js";
import { CourseEntity } from "./CourseEntity.js";
import { LabGroupEntity } from "./LabGroupEntity.js";

@Entity("enrollments")
export class EnrollmentEntity extends BaseEntity {
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
    labGroup: LabGroupEntity;

    @Column("date")
    enrollmentDate: Date;

    @Column("varchar", { length: 20, default: "active" })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}