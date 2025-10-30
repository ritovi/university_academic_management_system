import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { CourseEntity } from "./CourseEntity.js";
import { UserEntity } from "./UserEntity.js";

@Entity("lab_groups")
export class LabGroupEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    courseId: string;

    @ManyToOne(() => CourseEntity)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity;

    @Column("int")
    groupNumber: number;

    @Column("uuid")
    labProfessorId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "labProfessorId" })
    labProfessor: UserEntity;

    @Column("int", { default: 20 })
    capacity: number;

    @Column("text")
    schedule: string;

    @Column("int", { default: 0 })
    currentEnrollment: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}