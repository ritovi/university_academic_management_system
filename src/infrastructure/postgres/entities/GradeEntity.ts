import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StudentEntity } from "./student.model.js";
import { CourseEntity } from "./CourseEntity.js";
import { UserEntity } from "./UserEntity.js";

export enum GradeType {
    THEORY_EXAM = "theory_exam",
    LAB_EXAM = "lab_exam",
    MIDTERM = "midterm",
    FINAL = "final",
    ASSIGNMENT = "assignment",
    QUIZ = "quiz"
}

@Entity("grades")
export class GradeEntity extends BaseEntity {
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

    @Column({ type: "enum", enum: GradeType })
    gradeType: GradeType;

    @Column("decimal", { precision: 5, scale: 2 })
    score: number;

    @Column("decimal", { precision: 5, scale: 2 })
    maxScore: number;

    @Column("decimal", { precision: 5, scale: 2 })
    weight: number;

    @Column("date")
    examDate: Date;

    @Column("uuid")
    enteredBy: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "enteredBy" })
    professor: UserEntity;

    @Column("timestamp")
    enteredAt: Date;

    @Column("text", { nullable: true })
    comments: string | undefined;

    @CreateDateColumn()
    createdAt: Date;
}