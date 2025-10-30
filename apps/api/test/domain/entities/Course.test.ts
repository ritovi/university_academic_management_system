import { Course, CourseType } from "../../../src/domain/entities/Course.js";

describe("Course Entity", () => {
    test("should throw error when course code is empty", () => {
        expect(() => new Course(
            "", "Math", "desc", 3, "prof-1", "2025-1", CourseType.THEORY, 3, 0
        )).toThrowError("course code cannot be empty");
    });

    test("should throw error when credits are zero", () => {
        expect(() => new Course(
            "CS101", "Math", "desc", 0, "prof-1", "2025-1", CourseType.THEORY, 3, 0
        )).toThrowError("credits must be greater than zero");
    });

    test("should throw error when course type is invalid", () => {
        expect(() => new Course(
            "CS101", "Math", "desc", 3, "prof-1", "2025-1", "invalid" as any, 3, 0
        )).toThrowError("invalid course type");
    });

    test("should create course when data is valid", () => {
        const course = new Course(
            "CS101", "Math", "desc", 3, "prof-1", "2025-1",
            CourseType.THEORY, 3, 0
        );
        expect(course).toBeInstanceOf(Course);
        expect(course.code).toBe("CS101");
        expect(course.credits).toBe(3);
        expect(course.courseType).toBe(CourseType.THEORY);
    });
});
