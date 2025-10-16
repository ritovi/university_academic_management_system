import { Entity } from "./base/Entity.js";

export enum UserRole {
    ADMIN = "admin",
    SECRETARY = "secretary",
    PROFESSOR = "professor",
    STUDENT = "student"
}

export class User extends Entity {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly role: UserRole,
        public readonly name: string,
        public readonly surname: string,
        public readonly birthdate: Date,
        public readonly picture?: string,
        public readonly status: boolean = true,
        id?: string
    ) {
        super(id);
    }
}