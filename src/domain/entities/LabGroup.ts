import { Entity } from "./base/Entity.js";

export class LabGroup extends Entity {
    constructor(
        public readonly courseId: string,
        public readonly groupNumber: number,
        public readonly labProfessorId: string,
        public readonly capacity: number = 20,
        public readonly schedule: string,
        public readonly currentEnrollment: number = 0,
        id?: string
    ) {
        super(id);
    }
}