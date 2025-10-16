import { Entity } from "./base/Entity.js";

export class StudentProfile extends Entity {
    constructor(
        public readonly userId: string,
        public readonly studentCode: string,
        public readonly enrollmentDate: Date,
        public readonly career: string,
        public readonly semester: number,
        public readonly gpa?: number,
        id?: string
    ) {
        super(id);
    }
}