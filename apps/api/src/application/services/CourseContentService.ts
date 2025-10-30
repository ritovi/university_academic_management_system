import { Repository } from "typeorm";
import { CourseContentEntity } from "../../infrastructure/postgres/entities/CourseContentEntity.js";
import { CourseEntity } from "../../infrastructure/postgres/entities/CourseEntity.js";
import { BulkCreateCourseContentDTO, CreateCourseContentDTO } from "../dtos/CourseContentDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class CourseContentService {
    constructor(
        private readonly courseContentRepository: Repository<CourseContentEntity>,
        private readonly courseRepository: Repository<CourseEntity>
    ) {}

    async createCourseContent(dto: CreateCourseContentDTO, professorId: string) {
        const course = await this.courseRepository.findOne({
            where: { id: dto.courseId }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.theoryProfessorId !== professorId) {
            throw new AppError("Only the theory professor can upload course content", 403);
        }

        const existingContent = await this.courseContentRepository.findOne({
            where: {
                courseId: dto.courseId,
                weekNumber: dto.weekNumber
            }
        });

        if (existingContent) {
            throw new AppError("Content for this week already exists", 409);
        }

        const content = this.courseContentRepository.create({
            courseId: dto.courseId,
            weekNumber: dto.weekNumber,
            topic: dto.topic,
            description: dto.description,
            isCompleted: false
        });

        return await this.courseContentRepository.save(content);
    }

    async bulkCreateCourseContent(dto: BulkCreateCourseContentDTO, professorId: string) {
        const course = await this.courseRepository.findOne({
            where: { id: dto.courseId }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.theoryProfessorId !== professorId) {
            throw new AppError("Only the theory professor can upload course content", 403);
        }

        const contents = dto.contents.map(c => 
            this.courseContentRepository.create({
                courseId: dto.courseId,
                weekNumber: c.weekNumber,
                topic: c.topic,
                description: c.description,
                isCompleted: false
            })
        );

        await this.courseContentRepository.save(contents);

        return {
            message: "Course content uploaded successfully",
            count: contents.length
        };
    }

    async getCourseContent(courseId: string) {
        const contents = await this.courseContentRepository.find({
            where: { courseId },
            order: { weekNumber: "ASC" }
        });

        const totalWeeks = contents.length;
        const completedWeeks = contents.filter(c => c.isCompleted).length;
        const progress = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;

        return {
            contents,
            summary: {
                totalWeeks,
                completedWeeks,
                progress: progress.toFixed(2)
            }
        };
    }

    async updateContentCompletion(contentId: string, isCompleted: boolean) {
        const content = await this.courseContentRepository.findOne({
            where: { id: contentId }
        });

        if (!content) {
            throw new AppError("Content not found", 404);
        }

        content.isCompleted = isCompleted;
        content.completedDate = isCompleted ? new Date() : undefined;

        return await this.courseContentRepository.save(content);
    }
}