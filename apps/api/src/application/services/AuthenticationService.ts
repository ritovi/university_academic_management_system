import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { LoginDTO } from "../dtos/LoginDTO.js";
import { PasswordHasher } from "../../infrastructure/other/PasswordHasher.js";
import { JWTService } from "../../infrastructure/other/JWTService.js";
import { AppError } from "../../shared/errors/AppError.js";

export class AuthenticationService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly jwtService: JWTService
    ) {}

    async login(dto: LoginDTO) {
        const user = await this.userRepository.findByEmail(dto.email);
        
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
        
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", 401);
        }

        if (!user.status) {
            throw new AppError("User account is inactive", 403);
        }

        const token = this.jwtService.generateToken({
            id: user.id!,
            email: user.email,
            role: user.role
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname
            }
        };
    }
}