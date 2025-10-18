import { Repository } from "typeorm";
import { EnrollmentEntity } from "../../infrastructure/postgres/entities/EnrollmentEntity.js";
import { LabGroupEntity } from "../../infrastructure/postgres/entities/LabGroupEntity.js";
import { CourseEntity } from "../../infrastructure/postgres/entities/CourseEntity.js";
import { BulkEnrollmentDTO, CreateEnrollmentDTO } from "../dtos/EnrollmentDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class EnrollmentService {
    constructor(
        private readonly enrollmentRepository: Repository<EnrollmentEntity>,
        private readonly labGroupRepository: Repository<LabGroupEntity>,
        private readonly courseRepository: Repository<CourseEntity>
    ) {}

    async createEnrollment(dto: CreateEnrollmentDTO) {
        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: {
                studentId: dto.studentId,
                courseId: dto.courseId
            }
        });

        if (existingEnrollment) {
            throw new AppError("Student already enrolled in this course", 409);
        }

        if (dto.labGroupId) {
            const labGroup = await this.labGroupRepository.findOne({
                where: { id: dto.labGroupId }
            });

            if (!labGroup) {
                throw new AppError("Lab group not found", 404);
            }

            if (labGroup.currentEnrollment >= labGroup.capacity) {
                throw new AppError("Lab group is full", 400);
            }

            labGroup.currentEnrollment++;
            await this.labGroupRepository.save(labGroup);
        }

        const enrollment = this.enrollmentRepository.create({
            studentId: dto.studentId,
            courseId: dto.courseId,
            labGroupId: dto.labGroupId ?? undefined,
            enrollmentDate: new Date(),
            status: "active"
        });

        return await this.enrollmentRepository.save(enrollment);
    }

    async bulkEnrollment(dto: BulkEnrollmentDTO) {
        const course = await this.courseRepository.findOne({
            where: { id: dto.courseId }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const enrollments = [];
        const errors = [];

        if (dto.autoAssignLabs && course.labHoursPerWeek > 0) {
            const labGroups = await this.labGroupRepository.find({
                where: { courseId: dto.courseId },
                order: { currentEnrollment: "ASC" }
            });

            if (labGroups.length === 0) {
                throw new AppError("No lab groups available for this course", 400);
            }

            let currentGroupIndex = 0;

            for (const studentId of dto.studentIds) {
                const existingEnrollment = await this.enrollmentRepository.findOne({
                    where: { studentId, courseId: dto.courseId }
                });

                if (existingEnrollment) {
                    errors.push({ studentId, error: "Already enrolled" });
                    continue;
                }

                // Find next available lab group
                let assigned = false;
                for (let i = 0; i < labGroups.length; i++) {
                    const group = labGroups[currentGroupIndex];
                    if (group && (group.currentEnrollment <  group.capacity) ){ //==================================================================//
                        const enrollment = this.enrollmentRepository.create({
                            studentId,
                            courseId: dto.courseId,
                            labGroupId: group.id,
                            enrollmentDate: new Date(),
                            status: "active"
                        });

                        enrollments.push(enrollment);
                        group.currentEnrollment++;
                        assigned = true;
                        currentGroupIndex = (currentGroupIndex + 1) % labGroups.length;
                        break;
                    }
                    currentGroupIndex = (currentGroupIndex + 1) % labGroups.length;
                }

                if (!assigned) {
                    errors.push({ studentId, error: "All lab groups are full" });
                }
            }

            await this.labGroupRepository.save(labGroups);
        } else {
            for (const studentId of dto.studentIds) {
                const existingEnrollment = await this.enrollmentRepository.findOne({
                    where: { studentId, courseId: dto.courseId }
                });

                if (existingEnrollment) {
                    errors.push({ studentId, error: "Already enrolled" });
                    continue;
                }

                const enrollment = this.enrollmentRepository.create({
                    studentId,
                    courseId: dto.courseId,
                    labGroupId: undefined,
                    enrollmentDate: new Date(),
                    status: "active"
                });

                enrollments.push(enrollment);
            }
        }

        await this.enrollmentRepository.save(enrollments);

        return {
            message: "Bulk enrollment completed",
            enrolled: enrollments.length,
            errors
        };
    }

    async getStudentEnrollments(studentId: string) {
        return await this.enrollmentRepository.find({
            where: { studentId },
            relations: ["course", "labGroup"]
        });
    }

    async getCourseEnrollments(courseId: string) {
        return await this.enrollmentRepository.find({
            where: { courseId },
            relations: ["student", "student.user", "labGroup"]
        });
    }
}