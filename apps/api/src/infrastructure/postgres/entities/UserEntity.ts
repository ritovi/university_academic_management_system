import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    SECRETARY = "secretary",
    PROFESSOR = "professor",
    STUDENT = "student"
}

@Entity("users")
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        length: 100,
        nullable: false,
        unique: true
    })
    email: string;

    @Column("varchar", {
        length: 255,
        nullable: false
    })
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        nullable: false
    })
    role: UserRole;

    @Column("varchar", {
        length: 100,
        nullable: false
    })
    name: string;

    @Column("varchar", {
        length: 100,
        nullable: false
    })
    surname: string;

    @Column("date", {
        nullable: false
    })
    birthdate: Date;

    @Column("text", {
        nullable: true
    })
    picture: string;

    @Column("boolean", {
        default: true
    })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}