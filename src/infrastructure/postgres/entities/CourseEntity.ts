import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";

export enum CourseType {
    THEORY = "theory",
    LAB = "lab",
    THEORY_LAB = "theory_lab"
}

@Entity("courses")
export class CourseEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 20, unique: true })
    code: string;

    @Column("varchar", { length: 200 })
    name: string;

    @Column("text")
    description: string;

    @Column("int")
    credits: number;

    @Column("uuid")
    theoryProfessorId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "theoryProfessorId" })
    theoryProfessor: UserEntity;

    @Column("varchar", { length: 50 })
    semester: string;

    @Column({ type: "enum", enum: CourseType })
    courseType: CourseType;

    @Column("int", { default: 0 })
    theoryHoursPerWeek: number;

    @Column("int", { default: 0 })
    labHoursPerWeek: number;

    @Column("decimal", { precision: 5, scale: 2, nullable: true })
    theoryWeightPercentage: number;

    @Column("decimal", { precision: 5, scale: 2, nullable: true })
    labWeightPercentage: number;

    @Column("text", { nullable: true })
    syllabusUrl: string;

    @Column("text", { nullable: true })
    schedule: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}