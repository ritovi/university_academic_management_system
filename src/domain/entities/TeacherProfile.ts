import { Entity } from "./base/Entity.js";

export class TeacherProfile extends Entity {
    constructor(
        public readonly userId: string,
        public readonly employeeCode: string,
        public readonly department: string,
        public readonly specialization: string,
        public readonly hireDate: Date,
        public readonly officeLocation?: string,
        id?: string
    ) {
        super(id);
    }
}