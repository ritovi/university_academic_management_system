import { GradeType } from "../../domain/entities/Grade.js";

export type EnterGradeInput = {
    studentId: string;
    courseId: string;
    gradeType: string;
    score: number;
    maxScore: number;
    weight: number;
    examDate: string;
    comments?: string;
};

export class EnterGradeDTO {
    constructor(
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly gradeType: GradeType,
        public readonly score: number,
        public readonly maxScore: number,
        public readonly weight: number,
        public readonly examDate: Date,
        public readonly comments: string | null
    ) {}

    static create(object: EnterGradeInput): [string, undefined] | [undefined, EnterGradeDTO] {
        const {
            studentId,
            courseId,
            gradeType,
            score,
            maxScore,
            weight,
            examDate,
            comments = null
        } = object;

        if (!studentId) return ["Missing studentId", undefined];
        if (!courseId) return ["Missing courseId", undefined];
        if (!gradeType) return ["Missing gradeType", undefined];
        if (score === undefined) return ["Missing score", undefined];
        if (!maxScore) return ["Missing maxScore", undefined];
        if (weight === undefined) return ["Missing weight", undefined];
        if (!examDate) return ["Missing examDate", undefined];

        if (!Object.values(GradeType).includes(gradeType as GradeType)) {
            return ["Invalid gradeType", undefined];
        }

        if (score < 0 || score > maxScore) {
            return ["Score must be between 0 and maxScore", undefined];
        }

        const date = new Date(examDate);
        if (isNaN(date.getTime())) return ["Invalid examDate", undefined];

        return [
            undefined,
            new EnterGradeDTO(
                studentId,
                courseId,
                gradeType as GradeType,
                score,
                maxScore,
                weight,
                date,
                comments ?? null
            )
        ];
    }
}