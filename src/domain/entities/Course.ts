import { Entity } from "./base/Entity.js";

export enum CourseType {
    THEORY = "theory",
    LAB = "lab",
    THEORY_LAB = "theory_lab"
}

export class Course extends Entity {
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
        public readonly theoryWeightPercentage?: number,
        public readonly labWeightPercentage?: number,
        public readonly syllabusUrl?: string,
        public readonly schedule?: string,
        id?: string
    ) {
        super(id);
    }
}