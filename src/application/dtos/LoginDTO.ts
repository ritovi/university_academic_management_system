export type LoginInput = {
    email: string;
    password: string;
};

export class LoginDTO {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}

    static create(object: LoginInput): [string, undefined] | [undefined, LoginDTO] {
        const { email, password } = object;

        if (!email) return ["Missing email", undefined];
        if (!password) return ["Missing password", undefined];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ["Invalid email format", undefined];

        return [undefined, new LoginDTO(email, password)];
    }
}