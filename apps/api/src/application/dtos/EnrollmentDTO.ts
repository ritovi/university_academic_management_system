export type CreateEnrollmentInput = {
    studentId: string;
    courseId: string;
    labGroupId?: string;
};

export class CreateEnrollmentDTO {
    constructor(
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly labGroupId: string | null
    ) {}

    static create(object: CreateEnrollmentInput): [string, undefined] | [undefined, CreateEnrollmentDTO] {
        const { studentId, courseId, labGroupId = null } = object;

        if (!studentId) return ["Missing studentId", undefined];
        if (!courseId) return ["Missing courseId", undefined];

        return [undefined, new CreateEnrollmentDTO(studentId, courseId, labGroupId ?? null)];
    }
}

export type BulkEnrollmentInput = {
    courseId: string;
    studentIds: string[];
    autoAssignLabs?: boolean;
};

export class BulkEnrollmentDTO {
    constructor(
        public readonly courseId: string,
        public readonly studentIds: string[],
        public readonly autoAssignLabs: boolean
    ) {}

    static create(object: BulkEnrollmentInput): [string, undefined] | [undefined, BulkEnrollmentDTO] {
        const { courseId, studentIds, autoAssignLabs = true } = object;

        if (!courseId) return ["Missing courseId", undefined];
        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return ["Missing or invalid studentIds", undefined];
        }

        return [undefined, new BulkEnrollmentDTO(courseId, studentIds, autoAssignLabs)];
    }
}