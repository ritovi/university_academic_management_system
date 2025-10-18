import { AttendanceStatus, ClassType } from "../../domain/entities/Attendance.js";

export type MarkAttendanceInput = {
    studentId: string;
    courseId: string;
    labGroupId?: string;
    classDate: string;
    classType: string;
    status: string;
    weekNumber: number;
    notes?: string;
};

export class MarkAttendanceDTO {
    constructor(
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly labGroupId: string | null,
        public readonly classDate: Date,
        public readonly classType: ClassType,
        public readonly status: AttendanceStatus,
        public readonly weekNumber: number,
        public readonly notes: string | null
    ) {}

    static create(object: MarkAttendanceInput): [string, undefined] | [undefined, MarkAttendanceDTO] {
        const {
            studentId,
            courseId,
            labGroupId = null,
            classDate,
            classType,
            status,
            weekNumber,
            notes = null
        } = object;

        if (!studentId) return ["Missing studentId", undefined];
        if (!courseId) return ["Missing courseId", undefined];
        if (!classDate) return ["Missing classDate", undefined];
        if (!classType) return ["Missing classType", undefined];
        if (!status) return ["Missing status", undefined];
        if (weekNumber === undefined) return ["Missing weekNumber", undefined];

        if (!Object.values(ClassType).includes(classType as ClassType)) {
            return ["Invalid classType", undefined];
        }

        if (!Object.values(AttendanceStatus).includes(status as AttendanceStatus)) {
            return ["Invalid status", undefined];
        }

        const date = new Date(classDate);
        if (isNaN(date.getTime())) return ["Invalid classDate", undefined];

        return [
            undefined,
            new MarkAttendanceDTO(
                studentId,
                courseId,
                labGroupId ?? null,
                date,
                classType as ClassType,
                status as AttendanceStatus,
                weekNumber,
                notes ?? null
            )
        ];
    }
}

export type BulkMarkAttendanceInput = {
    courseId: string;
    labGroupId?: string;
    classDate: string;
    classType: string;
    weekNumber: number;
    attendances: Array<{
        studentId: string;
        status: string;
    }>;
};

export class BulkMarkAttendanceDTO {
    constructor(
        public readonly courseId: string,
        public readonly labGroupId: string | null,
        public readonly classDate: Date,
        public readonly classType: ClassType,
        public readonly weekNumber: number,
        public readonly attendances: Array<{
            studentId: string;
            status: AttendanceStatus;
        }>
    ) {}

    static create(object: BulkMarkAttendanceInput): [string, undefined] | [undefined, BulkMarkAttendanceDTO] {
        const {
            courseId,
            labGroupId = null,
            classDate,
            classType,
            weekNumber,
            attendances
        } = object;

        if (!courseId) return ["Missing courseId", undefined];
        if (!classDate) return ["Missing classDate", undefined];
        if (!classType) return ["Missing classType", undefined];
        if (weekNumber === undefined) return ["Missing weekNumber", undefined];
        if (!attendances || !Array.isArray(attendances)) return ["Missing or invalid attendances array", undefined];

        if (!Object.values(ClassType).includes(classType as ClassType)) {
            return ["Invalid classType", undefined];
        }

        const date = new Date(classDate);
        if (isNaN(date.getTime())) return ["Invalid classDate", undefined];

        const validatedAttendances = attendances.map(att => {
            if (!att.studentId || !att.status) {
                throw new Error("Invalid attendance record");
            }
            if (!Object.values(AttendanceStatus).includes(att.status as AttendanceStatus)) {
                throw new Error("Invalid attendance status");
            }
            return {
                studentId: att.studentId,
                status: att.status as AttendanceStatus
            };
        });

        return [
            undefined,
            new BulkMarkAttendanceDTO(
                courseId,
                labGroupId ?? null,
                date,
                classType as ClassType,
                weekNumber,
                validatedAttendances
            )
        ];
    }
}