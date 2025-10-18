import { Entity } from "./base/Entity.js";

export class Enrollment extends Entity {
    constructor(
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly labGroupId: string | null,
        public readonly enrollmentDate: Date,
        public readonly status: string = "active",
        id?: string
    ) {
        super(id);
    }
}