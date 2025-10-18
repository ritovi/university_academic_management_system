import { Entity } from "./base/Entity.js";

export class CourseContent extends Entity {
    constructor(
        public readonly courseId: string,
        public readonly weekNumber: number,
        public readonly topic: string,
        public readonly description: string,
        public readonly isCompleted: boolean = false,
        public readonly completedDate?: Date,
        id?: string
    ) {
        super(id);
    }
}