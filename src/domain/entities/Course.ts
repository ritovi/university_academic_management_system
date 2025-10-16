import { Entity } from "./base/Entity.js";

export class Course extends Entity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly description: string,
        public readonly credits: number,
        public readonly professorId: string,
        public readonly semester: string,
        public readonly capacity: number,
        public readonly schedule?: string,
        id?: string
    ) {
        super(id);
    }
}