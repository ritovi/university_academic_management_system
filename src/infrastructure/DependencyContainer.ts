import { DataSource } from "typeorm";
import { UserEntity } from "./postgres/entities/UserEntity.js";
import { UserRepository } from "./postgres/repositories/UserRepository.js";
import { PasswordHasher } from "./other/PasswordHasher.js";
import { JWTService } from "./other/JWTService.js";
import { UserService } from "../application/services/UserService.js";
import { AuthenticationService } from "../application/services/AuthenticationService.js";

export class DependencyContainer {
    private static instance: DependencyContainer;
    
    public readonly userRepository: UserRepository;
    public readonly passwordHasher: PasswordHasher;
    public readonly jwtService: JWTService;
    public readonly userService: UserService;
    public readonly authService: AuthenticationService;

    private constructor(dataSource: DataSource) {
        // Infrastructure
        this.userRepository = new UserRepository(dataSource.getRepository(UserEntity));
        this.passwordHasher = new PasswordHasher();
        this.jwtService = new JWTService();

        // Application Services
        this.userService = new UserService(this.userRepository, this.passwordHasher);
        this.authService = new AuthenticationService(
            this.userRepository,
            this.passwordHasher,
            this.jwtService
        );
    }

    static initialize(dataSource: DataSource): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer(dataSource);
        }
        return DependencyContainer.instance;
    }

    static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            throw new Error("DependencyContainer not initialized");
        }
        return DependencyContainer.instance;
    }
}