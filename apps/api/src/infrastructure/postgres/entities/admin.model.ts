import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";

@Entity("admins")
export class AdminEntity extends BaseEntity {
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
    employeeCode: string;

    @Column("varchar", {
        length: 50,
        nullable: false
    })
    accessLevel: string;

    @Column("date", {
        nullable: false
    })
    assignedDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}