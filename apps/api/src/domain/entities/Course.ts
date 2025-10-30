import { Entity } from "./base/Entity.js";

export enum CourseType {
    THEORY = "theory",
    LAB = "lab",
    THEORY_LAB = "theory_lab"
}

export class Course extends Entity {
    constructor(
        public readonly code: string, // INVARIANT: cannot be empty
        public readonly name: string, // INVARIANT: cannot be empty
        public readonly description: string,
        public readonly credits: number, // INVARIANT: must be greater than zero
        public readonly theoryProfessorId: string, // INVARIANT: cannot be empty
        public readonly semester: string, // INVARIANT: cannot be empty
        public readonly courseType: CourseType, // INVARIANT: must belong to the courseType
        public readonly theoryHoursPerWeek: number,
        public readonly labHoursPerWeek: number,
        public readonly theoryWeightPercentage?: number,
        public readonly labWeightPercentage?: number,
        public readonly syllabusUrl?: string,
        public readonly schedule?: string,
        id?: string
    ) {
        super(id);

        if (!code?.trim()) throw new Error("code cannot be empty");
        if (!name?.trim()) throw new Error("name cannot be empty");
        if (credits <= 0) throw new Error("credits must be greater than zero");
        if (!theoryProfessorId?.trim())
            throw new Error("theory professor ID cannot be empty");
        if (!Object.values(CourseType).includes(courseType))
            throw new Error("invalid course type");
        if (!semester?.trim()) throw new Error("semester cannot be empty");
    }
}