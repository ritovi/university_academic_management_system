import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";

@Entity("professors")
export class ProfessorEntity extends BaseEntity {
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
        length: 100,
        nullable: false
    })
    department: string;

    @Column("varchar", {
        length: 150,
        nullable: false
    })
    specialization: string;

    @Column("date", {
        nullable: false
    })
    hireDate: Date;

    @Column("varchar", {
        length: 100,
        nullable: true
    })
    officeLocation: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}