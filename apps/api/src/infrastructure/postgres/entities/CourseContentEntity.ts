import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { CourseEntity } from "./CourseEntity.js";

@Entity("course_contents")
export class CourseContentEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    courseId: string;

    @ManyToOne(() => CourseEntity)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity;

    @Column("int")
    weekNumber: number;

    @Column("varchar", { length: 200 })
    topic: string;

    @Column("text")
    description: string;

    @Column("boolean", { default: false })
    isCompleted: boolean;

    @Column("timestamp", { nullable: true })
    completedDate: Date | undefined;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}