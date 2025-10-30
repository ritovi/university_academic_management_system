export type CreateCourseContentInput = {
    courseId: string;
    weekNumber: number;
    topic: string;
    description: string;
};

export class CreateCourseContentDTO {
    constructor(
        public readonly courseId: string,
        public readonly weekNumber: number,
        public readonly topic: string,
        public readonly description: string
    ) {}

    static create(object: CreateCourseContentInput): [string, undefined] | [undefined, CreateCourseContentDTO] {
        const { courseId, weekNumber, topic, description } = object;

        if (!courseId) return ["Missing courseId", undefined];
        if (weekNumber === undefined) return ["Missing weekNumber", undefined];
        if (!topic) return ["Missing topic", undefined];
        if (!description) return ["Missing description", undefined];

        if (weekNumber < 1 || weekNumber > 20) {
            return ["Week number must be between 1 and 20", undefined];
        }

        return [undefined, new CreateCourseContentDTO(courseId, weekNumber, topic, description)];
    }
}

export type BulkCreateCourseContentInput = {
    courseId: string;
    contents: Array<{
        weekNumber: number;
        topic: string;
        description: string;
    }>;
};

export class BulkCreateCourseContentDTO {
    constructor(
        public readonly courseId: string,
        public readonly contents: Array<{
            weekNumber: number;
            topic: string;
            description: string;
        }>
    ) {}

    static create(object: BulkCreateCourseContentInput): [string, undefined] | [undefined, BulkCreateCourseContentDTO] {
        const { courseId, contents } = object;

        if (!courseId) return ["Missing courseId", undefined];
        if (!contents || !Array.isArray(contents) || contents.length === 0) {
            return ["Missing or invalid contents array", undefined];
        }

        for (const content of contents) {
            if (!content.topic || !content.description || content.weekNumber === undefined) {
                return ["Invalid content structure", undefined];
            }
            if (content.weekNumber < 1 || content.weekNumber > 20) {
                return ["Week number must be between 1 and 20", undefined];
            }
        }

        return [undefined, new BulkCreateCourseContentDTO(courseId, contents)];
    }
}