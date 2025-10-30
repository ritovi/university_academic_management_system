import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { User } from "../../domain/entities/User.js";
import { CreateUserDTO } from "../dtos/CreateUserDTO.js";
import { PasswordHasher } from "../../infrastructure/other/PasswordHasher.js";
import { AppError } from "../../shared/errors/AppError.js";

export class UserService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: PasswordHasher
    ) {}

    async createUser(dto: CreateUserDTO) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        
        if (existingUser) {
            throw new AppError("Email already in use", 409);
        }

        const hashedPassword = await this.passwordHasher.hash(dto.password);

        const user = new User(
            dto.email,
            hashedPassword,
            dto.role,
            dto.name,
            dto.surname,
            dto.birthdate,
            dto.picture ?? undefined,
            dto.status
        );

        const createdUser = await this.userRepository.create(user);

        return {
            id: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
            name: createdUser.name,
            surname: createdUser.surname,
            birthdate: createdUser.birthdate,
            status: createdUser.status
        };
    }

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new AppError("User not found", 404);
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            surname: user.surname,
            birthdate: user.birthdate,
            picture: user.picture,
            status: user.status
        };
    }

    async findAll() {
        const users = await this.userRepository.findAll();
        
        return users.map(user => ({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            surname: user.surname,
            status: user.status
        }));
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new AppError("User not found", 404);
        }

        await this.userRepository.delete(id);

        return {
            message: "User deleted successfully",
            deletedUserId: id
        };
    }

    async updateUserStatus(id: string, status: boolean) {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new AppError("User not found", 404);
        }

        await this.userRepository.update(id, { status });

        return {
            message: "User status updated successfully",
            id,
            status
        };
    }
}