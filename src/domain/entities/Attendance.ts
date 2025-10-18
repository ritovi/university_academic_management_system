import { Entity } from "./base/Entity.js";

export enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused"
}

export enum ClassType {
    THEORY = "theory",
    LAB = "lab"
}

export class Attendance extends Entity {
    constructor(
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly labGroupId: string | null,
        public readonly classDate: Date,
        public readonly classType: ClassType,
        public readonly status: AttendanceStatus,
        public readonly markedBy: string,
        public readonly markedAt: Date,
        public readonly weekNumber: number,
        public readonly notes?: string,
        id?: string
    ) {
        super(id);
    }
}