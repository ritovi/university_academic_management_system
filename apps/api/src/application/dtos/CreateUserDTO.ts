import { UserRole } from "../../domain/entities/User.js";

export type CreateUserInput = {
    email: string;
    password: string;
    role: string;
    name: string;
    surname: string;
    birthdate: string;
    picture?: string;
    status?: boolean;
};

export class CreateUserDTO {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly role: UserRole,
        public readonly name: string,
        public readonly surname: string,
        public readonly birthdate: Date,
        public readonly picture: string | null,
        public readonly status: boolean
    ) {}

    static create(object: CreateUserInput): [string, undefined] | [undefined, CreateUserDTO] {
        const { email, password, role, name, surname, birthdate, picture = null, status = true } = object;

        if (!email) return ["Missing email", undefined];
        if (!password) return ["Missing password", undefined];
        if (!role) return ["Missing role", undefined];
        if (!name) return ["Missing name", undefined];
        if (!surname) return ["Missing surname", undefined];
        if (!birthdate) return ["Missing birthdate", undefined];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ["Invalid email format", undefined];

        if (!Object.values(UserRole).includes(role as UserRole)) {
            return ["Invalid role", undefined];
        }

        const date = new Date(birthdate);
        if (isNaN(date.getTime())) return ["Invalid birthdate", undefined];

        return [
            undefined,
            new CreateUserDTO(email, password, role as UserRole, name, surname, date, picture ?? null, status)
        ];
    }
}