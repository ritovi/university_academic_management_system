import { CourseType } from "../../domain/entities/Course.js";

export type CreateCourseInput = {
    code: string;
    name: string;
    description: string;
    credits: number;
    theoryProfessorId: string;
    semester: string;
    courseType: string;
    theoryHoursPerWeek: number;
    labHoursPerWeek: number;
    theoryWeightPercentage?: number;
    labWeightPercentage?: number;
    schedule?: string;
};

export class CreateCourseDTO {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly description: string,
        public readonly credits: number,
        public readonly theoryProfessorId: string,
        public readonly semester: string,
        public readonly courseType: CourseType,
        public readonly theoryHoursPerWeek: number,
        public readonly labHoursPerWeek: number,
        public readonly theoryWeightPercentage: number | null,
        public readonly labWeightPercentage: number | null,
        public readonly schedule: string | null
    ) {}

    static create(object: CreateCourseInput): [string, undefined] | [undefined, CreateCourseDTO] {
        const {
            code,
            name,
            description,
            credits,
            theoryProfessorId,
            semester,
            courseType,
            theoryHoursPerWeek,
            labHoursPerWeek,
            theoryWeightPercentage = null,
            labWeightPercentage = null,
            schedule = null
        } = object;

        if (!code) return ["Missing code", undefined];
        if (!name) return ["Missing name", undefined];
        if (!description) return ["Missing description", undefined];
        if (!credits) return ["Missing credits", undefined];
        if (!theoryProfessorId) return ["Missing theoryProfessorId", undefined];
        if (!semester) return ["Missing semester", undefined];
        if (!courseType) return ["Missing courseType", undefined];
        if (theoryHoursPerWeek === undefined) return ["Missing theoryHoursPerWeek", undefined];
        if (labHoursPerWeek === undefined) return ["Missing labHoursPerWeek", undefined];

        if (!Object.values(CourseType).includes(courseType as CourseType)) {
            return ["Invalid courseType", undefined];
        }

        return [
            undefined,
            new CreateCourseDTO(
                code,
                name,
                description,
                credits,
                theoryProfessorId,
                semester,
                courseType as CourseType,
                theoryHoursPerWeek,
                labHoursPerWeek,
                theoryWeightPercentage ?? null,
                labWeightPercentage ?? null,
                schedule ?? null
            )
        ];
    }
}

export type UploadSyllabusInput = {
    courseId: string;
    syllabusUrl: string;
};

export class UploadSyllabusDTO {
    constructor(
        public readonly courseId: string,
        public readonly syllabusUrl: string
    ) {}

    static create(object: UploadSyllabusInput): [string, undefined] | [undefined, UploadSyllabusDTO] {
        const { courseId, syllabusUrl } = object;

        if (!courseId) return ["Missing courseId", undefined];
        if (!syllabusUrl) return ["Missing syllabusUrl", undefined];

        return [undefined, new UploadSyllabusDTO(courseId, syllabusUrl)];
    }
}