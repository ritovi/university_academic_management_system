import { Repository } from "typeorm";
import { CourseEntity } from "../../infrastructure/postgres/entities/CourseEntity.js";
import { CreateCourseDTO, UploadSyllabusDTO } from "../dtos/CourseDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class CourseService {
    constructor(
        private readonly courseRepository: Repository<CourseEntity>
    ) {}

    async createCourse(dto: CreateCourseDTO) {
        const existingCourse = await this.courseRepository.findOne({
            where: { code: dto.code }
        });

        if (existingCourse) {
            throw new AppError("Course code already exists", 409);
        }

        const course = this.courseRepository.create({
            code: dto.code,
            name: dto.name,
            description: dto.description,
            credits: dto.credits,
            theoryProfessorId: dto.theoryProfessorId,
            semester: dto.semester,
            courseType: dto.courseType,
            theoryHoursPerWeek: dto.theoryHoursPerWeek,
            labHoursPerWeek: dto.labHoursPerWeek,
            theoryWeightPercentage: dto.theoryWeightPercentage ?? undefined,
            labWeightPercentage: dto.labWeightPercentage ?? undefined,
            schedule: dto.schedule ?? undefined
        });

        const savedCourse = await this.courseRepository.save(course);
        return savedCourse;
    }

    async uploadSyllabus(dto: UploadSyllabusDTO, professorId: string) {
        const course = await this.courseRepository.findOne({
            where: { id: dto.courseId }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.theoryProfessorId !== professorId) {
            throw new AppError("Only the theory professor can upload the syllabus", 403);
        }

        course.syllabusUrl = dto.syllabusUrl;
        await this.courseRepository.save(course);

        return { message: "Syllabus uploaded successfully", syllabusUrl: dto.syllabusUrl };
    }

    async getCourseById(id: string) {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ["theoryProfessor"]
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        return course;
    }

    async getAllCourses() {
        return await this.courseRepository.find({
            relations: ["theoryProfessor"]
        });
    }

    async getCoursesByProfessor(professorId: string) {
        return await this.courseRepository.find({
            where: { theoryProfessorId: professorId },
            relations: ["theoryProfessor"]
        });
    }

    async updateCourseWeights(courseId: string, theoryWeight: number, labWeight: number) {
        const course = await this.courseRepository.findOne({
            where: { id: courseId }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (theoryWeight + labWeight !== 100) {
            throw new AppError("Theory and lab weights must sum to 100", 400);
        }

        course.theoryWeightPercentage = theoryWeight;
        course.labWeightPercentage = labWeight;

        await this.courseRepository.save(course);
        return { message: "Course weights updated successfully" };
    }
}