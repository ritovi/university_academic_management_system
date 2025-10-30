import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";

@Entity("students")
export class StudentEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    userId: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Column("varchar", {
        length: 50,
        nullable: false,
        unique: true
    })
    studentCode: string;

    @Column("date", {
        nullable: false
    })
    enrollmentDate: Date;

    @Column("varchar", {
        length: 100,
        nullable: false
    })
    career: string;

    @Column("int", {
        nullable: false
    })
    semester: number;

    @Column("decimal", {
        precision: 3,
        scale: 2,
        nullable: true
    })
    gpa: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}