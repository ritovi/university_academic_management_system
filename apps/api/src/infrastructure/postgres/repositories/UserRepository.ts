import { Repository } from "typeorm";
import { UserEntity } from "../entities/UserEntity.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { User, UserRole } from "../../../domain/entities/User.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class UserRepository implements IUserRepository {
    constructor(private readonly repository: Repository<UserEntity>) {}

    async create(user: User): Promise<User> {
        const userEntity = this.repository.create({
            email: user.email,
            password: user.password,
            role: user.role,
            name: user.name,
            surname: user.surname,
            birthdate: user.birthdate,
            picture: user.picture,
            status: user.status
        });

        const savedUser = await this.repository.save(userEntity);
        return this.toDomain(savedUser);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.repository.findOne({ where: { id } });
        return user ? this.toDomain(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repository.findOne({ where: { email } });
        return user ? this.toDomain(user) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await this.repository.find();
        return users.map(user => this.toDomain(user));
    }

    async update(id: string, userData: Partial<User>): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });
        
        if (!user) {
            throw new AppError("User not found", 404);
        }

        Object.assign(user, userData);
        const updatedUser = await this.repository.save(user);
        return this.toDomain(updatedUser);
    }

    async delete(id: string): Promise<void> {
        const result = await this.repository.delete(id);
        
        if (result.affected === 0) {
            throw new AppError("User not found", 404);
        }
    }

    private toDomain(userEntity: UserEntity): User {
        return new User(
            userEntity.email,
            userEntity.password,
            userEntity.role,
            userEntity.name,
            userEntity.surname,
            userEntity.birthdate,
            userEntity.picture,
            userEntity.status,
            userEntity.id
        );
    }
}