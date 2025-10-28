import { DataSource } from "typeorm";
import { UserEntity } from "./postgres/entities/UserEntity.js";
import { CourseEntity } from "./postgres/entities/CourseEntity.js";
import { LabGroupEntity } from "./postgres/entities/LabGroupEntity.js";
import { EnrollmentEntity } from "./postgres/entities/EnrollmentEntity.js";
import { CourseContentEntity } from "./postgres/entities/CourseContentEntity.js";
import { AttendanceEntity } from "./postgres/entities/AttendanceEntity.js";
import { GradeEntity } from "./postgres/entities/GradeEntity.js";
import { LabReservationEntity } from "./postgres/entities/LabReservationEntity.js";

import { UserRepository } from "./postgres/repositories/UserRepository.js";
import { PasswordHasher } from "./other/PasswordHasher.js";
import { JWTService } from "./other/JWTService.js";
import { IPService } from "./other/IPService.js";

import { UserService } from "../application/services/UserService.js";
import { AuthenticationService } from "../application/services/AuthenticationService.js";
import { CourseService } from "../application/services/CourseService.js";
import { CourseContentService } from "../application/services/CourseContentService.js";
import { AttendanceService } from "../application/services/AttendanceService.js";
import { GradeService } from "../application/services/GradeService.js";
import { EnrollmentService } from "../application/services/EnrollmentService.js";
import { LabGroupService } from "../application/services/LabGroupService.js";
import { LabReservationService } from "../application/services/LabReservationService.js";
import { ReportService } from "../application/services/ReportService.js";

export class DependencyContainer {
    private static instance: DependencyContainer;
    
    public readonly userRepository: UserRepository;
    public readonly passwordHasher: PasswordHasher;
    public readonly jwtService: JWTService;
    public readonly ipService: IPService;
    
    public readonly userService: UserService;
    public readonly authService: AuthenticationService;
    public readonly courseService: CourseService;
    public readonly courseContentService: CourseContentService;
    public readonly attendanceService: AttendanceService;
    public readonly gradeService: GradeService;
    public readonly enrollmentService: EnrollmentService;
    public readonly labGroupService: LabGroupService;
    public readonly labReservationService: LabReservationService;
    public readonly reportService: ReportService;

    private constructor(dataSource: DataSource) {
        // Repositories
        const userRepo = dataSource.getRepository(UserEntity);
        const courseRepo = dataSource.getRepository(CourseEntity);
        const labGroupRepo = dataSource.getRepository(LabGroupEntity);
        const enrollmentRepo = dataSource.getRepository(EnrollmentEntity);
        const courseContentRepo = dataSource.getRepository(CourseContentEntity);
        const attendanceRepo = dataSource.getRepository(AttendanceEntity);
        const gradeRepo = dataSource.getRepository(GradeEntity);
        const labReservationRepo = dataSource.getRepository(LabReservationEntity);

        // Infrastructure
        this.userRepository = new UserRepository(userRepo);
        this.passwordHasher = new PasswordHasher();
        this.jwtService = new JWTService();
        this.ipService = new IPService();

        // Application Services
        this.userService = new UserService(this.userRepository, this.passwordHasher);
        this.authService = new AuthenticationService(
            this.userRepository,
            this.passwordHasher,
            this.jwtService
        );
        
        this.courseService = new CourseService(courseRepo);
        this.courseContentService = new CourseContentService(courseContentRepo, courseRepo);
        this.attendanceService = new AttendanceService(attendanceRepo, enrollmentRepo, courseContentRepo);
        this.gradeService = new GradeService(gradeRepo, courseRepo);
        this.enrollmentService = new EnrollmentService(enrollmentRepo, labGroupRepo, courseRepo);
        this.labGroupService = new LabGroupService(labGroupRepo);
        this.labReservationService = new LabReservationService(labReservationRepo);
        this.reportService = new ReportService(attendanceRepo, gradeRepo, courseContentRepo, enrollmentRepo);
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