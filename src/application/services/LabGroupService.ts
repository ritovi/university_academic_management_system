import { Repository } from "typeorm";
import { LabGroupEntity } from "../../infrastructure/postgres/entities/LabGroupEntity.js";
import { AppError } from "../../shared/errors/AppError.js";

export class LabGroupService {
    constructor(
        private readonly labGroupRepository: Repository<LabGroupEntity>
    ) {}

    async createLabGroup(courseId: string, groupNumber: number, labProfessorId: string, schedule: string, capacity: number = 20) {
        const existingGroup = await this.labGroupRepository.findOne({
            where: { courseId, groupNumber }
        });

        if (existingGroup) {
            throw new AppError("Lab group number already exists for this course", 409);
        }

        const labGroup = this.labGroupRepository.create({
            courseId,
            groupNumber,
            labProfessorId,
            schedule,
            capacity,
            currentEnrollment: 0
        });

        return await this.labGroupRepository.save(labGroup);
    }

    async getLabGroupsByCourse(courseId: string) {
        return await this.labGroupRepository.find({
            where: { courseId },
            relations: ["labProfessor", "course"]
        });
    }

    async getLabGroupsByProfessor(professorId: string) {
        return await this.labGroupRepository.find({
            where: { labProfessorId: professorId },
            relations: ["course"]
        });
    }

    async updateLabGroupCapacity(labGroupId: string, newCapacity: number) {
        const labGroup = await this.labGroupRepository.findOne({
            where: { id: labGroupId }
        });

        if (!labGroup) {
            throw new AppError("Lab group not found", 404);
        }

        if (newCapacity < labGroup.currentEnrollment) {
            throw new AppError("New capacity cannot be less than current enrollment", 400);
        }

        labGroup.capacity = newCapacity;
        return await this.labGroupRepository.save(labGroup);
    }
}