import { Entity } from "./base/Entity.js";

export enum GradeType {
    THEORY_EXAM = "theory_exam",
    LAB_EXAM = "lab_exam",
    MIDTERM = "midterm",
    FINAL = "final",
    ASSIGNMENT = "assignment",
    QUIZ = "quiz"
}

export class Grade extends Entity {
    constructor(
        public readonly studentId: string,
        public readonly courseId: string,
        public readonly gradeType: GradeType,
        public readonly score: number,
        public readonly maxScore: number,
        public readonly weight: number,
        public readonly examDate: Date,
        public readonly enteredBy: string,
        public readonly enteredAt: Date,
        public readonly comments?: string,
        id?: string
    ) {
        super(id);
    }
}