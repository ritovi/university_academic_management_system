import { Repository } from "typeorm";
import { GradeEntity } from "../../infrastructure/postgres/entities/GradeEntity.js";
import { CourseEntity } from "../../infrastructure/postgres/entities/CourseEntity.js";
import { EnterGradeDTO } from "../dtos/GradeDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class GradeService {
    constructor(
        private readonly gradeRepository: Repository<GradeEntity>,
        private readonly courseRepository: Repository<CourseEntity>
    ) {}

    async enterGrade(dto: EnterGradeDTO, professorId: string) {
        const course = await this.courseRepository.findOne({
            where: { id: dto.courseId }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.theoryProfessorId !== professorId) {
            throw new AppError("Only the theory professor can enter grades", 403);
        }

        const grade = this.gradeRepository.create({
            studentId: dto.studentId,
            courseId: dto.courseId,
            gradeType: dto.gradeType,
            score: dto.score,
            maxScore: dto.maxScore,
            weight: dto.weight,
            examDate: dto.examDate,
            enteredBy: professorId,
            enteredAt: new Date(),
            comments: dto.comments ?? undefined
        });

        const savedGrade = await this.gradeRepository.save(grade);
        return savedGrade;
    }

    async getStudentGrades(studentId: string, courseId: string) {
        const grades = await this.gradeRepository.find({
            where: { studentId, courseId },
            order: { examDate: "ASC" }
        });

        const totalWeightedScore = grades.reduce((sum, grade) => {
            const percentage = (grade.score / grade.maxScore) * 100;
            return sum + (percentage * grade.weight / 100);
        }, 0);

        return {
            grades,
            finalGrade: totalWeightedScore.toFixed(2)
        };
    }

    async getCourseGradesReport(courseId: string) {
        const grades = await this.gradeRepository.find({
            where: { courseId },
            relations: ["student", "student.user"]
        });

        const studentMap = new Map();

        for (const grade of grades) {
            if (!studentMap.has(grade.studentId)) {
                studentMap.set(grade.studentId, {
                    studentId: grade.studentId,
                    studentName: `${grade.student.user.name} ${grade.student.user.surname}`,
                    grades: [],
                    totalWeightedScore: 0
                });
            }

            const studentData = studentMap.get(grade.studentId);
            const percentage = (grade.score / grade.maxScore) * 100;
            const weightedScore = (percentage * grade.weight) / 100;

            studentData.grades.push({
                gradeType: grade.gradeType,
                score: grade.score,
                maxScore: grade.maxScore,
                percentage: percentage.toFixed(2),
                weight: grade.weight,
                examDate: grade.examDate
            });

            studentData.totalWeightedScore += weightedScore;
        }

        const report = Array.from(studentMap.values()).map(data => ({
            studentId: data.studentId,
            studentName: data.studentName,
            grades: data.grades,
            finalGrade: data.totalWeightedScore.toFixed(2)
        }));

        return report;
    }

    async getGradeStatistics(courseId: string) {
        const grades = await this.gradeRepository.find({
            where: { courseId }
        });

        if (grades.length === 0) {
            return {
                average: 0,
                highest: 0,
                lowest: 0,
                totalStudents: 0,
                passRate: 0
            };
        }

        const scores = grades.map(g => (g.score / g.maxScore) * 100);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const passRate = (scores.filter(s => s >= 60).length / scores.length) * 100;

        return {
            average: average.toFixed(2),
            highest: highest.toFixed(2),
            lowest: lowest.toFixed(2),
            totalStudents: new Set(grades.map(g => g.studentId)).size,
            passRate: passRate.toFixed(2)
        };
    }
}