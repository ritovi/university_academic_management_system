import { Repository } from "typeorm";
import { AttendanceEntity } from "../../infrastructure/postgres/entities/AttendanceEntity.js";
import { GradeEntity } from "../../infrastructure/postgres/entities/GradeEntity.js";
import { CourseContentEntity } from "../../infrastructure/postgres/entities/CourseContentEntity.js";
import { EnrollmentEntity } from "../../infrastructure/postgres/entities/EnrollmentEntity.js";
import { AppError } from "../../shared/errors/AppError.js";

export class ReportService {
    constructor(
        private readonly attendanceRepository: Repository<AttendanceEntity>,
        private readonly gradeRepository: Repository<GradeEntity>,
        private readonly courseContentRepository: Repository<CourseContentEntity>,
        private readonly enrollmentRepository: Repository<EnrollmentEntity>
    ) {}

    async generateCourseReport(courseId: string) {
        const enrollments = await this.enrollmentRepository.find({
            where: { courseId },
            relations: ["student", "student.user"]
        });

        if (enrollments.length === 0) {
            throw new AppError("No enrollments found for this course", 404);
        }

        const studentIds = enrollments.map(e => e.studentId);
        
        const attendances = await this.attendanceRepository.find({
            where: { courseId }
        });

        const grades = await this.gradeRepository.find({
            where: { courseId }
        });

        const courseContent = await this.courseContentRepository.find({
            where: { courseId },
            order: { weekNumber: "ASC" }
        });

        const studentReports = [];

        for (const enrollment of enrollments) {
            const studentAttendances = attendances.filter(a => a.studentId === enrollment.studentId);
            const studentGrades = grades.filter(g => g.studentId === enrollment.studentId);

            const totalClasses = studentAttendances.length;
            const presentCount = studentAttendances.filter(a => a.status === "present").length;
            const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

            const totalWeightedScore = studentGrades.reduce((sum, grade) => {
                const percentage = (grade.score / grade.maxScore) * 100;
                return sum + (percentage * grade.weight / 100);
            }, 0);

            studentReports.push({
                studentId: enrollment.studentId,
                studentName: `${enrollment.student.user.name} ${enrollment.student.user.surname}`,
                studentCode: enrollment.student.studentCode,
                attendance: {
                    totalClasses,
                    present: presentCount,
                    absent: studentAttendances.filter(a => a.status === "absent").length,
                    attendancePercentage: attendancePercentage.toFixed(2)
                },
                grades: {
                    entries: studentGrades.map(g => ({
                        type: g.gradeType,
                        score: g.score,
                        maxScore: g.maxScore,
                        percentage: ((g.score / g.maxScore) * 100).toFixed(2)
                    })),
                    finalGrade: totalWeightedScore.toFixed(2)
                }
            });
        }

        const totalContentWeeks = courseContent.length;
        const completedWeeks = courseContent.filter(c => c.isCompleted).length;
        const courseProgress = totalContentWeeks > 0 ? (completedWeeks / totalContentWeeks) * 100 : 0;

        // Calculate statistics for charts
        const attendanceDistribution = {
            excellent: studentReports.filter(s => parseFloat(s.attendance.attendancePercentage) >= 90).length,
            good: studentReports.filter(s => parseFloat(s.attendance.attendancePercentage) >= 75 && parseFloat(s.attendance.attendancePercentage) < 90).length,
            average: studentReports.filter(s => parseFloat(s.attendance.attendancePercentage) >= 60 && parseFloat(s.attendance.attendancePercentage) < 75).length,
            poor: studentReports.filter(s => parseFloat(s.attendance.attendancePercentage) < 60).length
        };

        const gradeDistribution = {
            A: studentReports.filter(s => parseFloat(s.grades.finalGrade) >= 90).length,
            B: studentReports.filter(s => parseFloat(s.grades.finalGrade) >= 80 && parseFloat(s.grades.finalGrade) < 90).length,
            C: studentReports.filter(s => parseFloat(s.grades.finalGrade) >= 70 && parseFloat(s.grades.finalGrade) < 80).length,
            D: studentReports.filter(s => parseFloat(s.grades.finalGrade) >= 60 && parseFloat(s.grades.finalGrade) < 70).length,
            F: studentReports.filter(s => parseFloat(s.grades.finalGrade) < 60).length
        };

        return {
            courseId,
            totalStudents: studentReports.length,
            courseProgress: courseProgress.toFixed(2),
            courseContent: {
                totalWeeks: totalContentWeeks,
                completedWeeks,
                topics: courseContent
            },
            students: studentReports,
            statistics: {
                attendanceDistribution,
                gradeDistribution
            }
        };
    }

    async generateStudentProgressReport(studentId: string, courseId: string) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { studentId, courseId },
            relations: ["student", "student.user", "course"]
        });

        if (!enrollment) {
            throw new AppError("Student not enrolled in this course", 404);
        }

        const attendances = await this.attendanceRepository.find({
            where: { studentId, courseId },
            order: { classDate: "ASC" }
        });

        const grades = await this.gradeRepository.find({
            where: { studentId, courseId },
            order: { examDate: "ASC" }
        });

        const courseContent = await this.courseContentRepository.find({
            where: { courseId },
            order: { weekNumber: "ASC" }
        });

        const totalClasses = attendances.length;
        const presentCount = attendances.filter(a => a.status === "present").length;
        const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

        const totalWeightedScore = grades.reduce((sum, grade) => {
            const percentage = (grade.score / grade.maxScore) * 100;
            return sum + (percentage * grade.weight / 100);
        }, 0);

        const courseProgress = courseContent.filter(c => c.isCompleted).length;
        const totalWeeks = courseContent.length;
        const progressPercentage = totalWeeks > 0 ? (courseProgress / totalWeeks) * 100 : 0;

        return {
            student: {
                id: studentId,
                name: `${enrollment.student.user.name} ${enrollment.student.user.surname}`,
                code: enrollment.student.studentCode
            },
            course: {
                id: courseId,
                name: enrollment.course.name,
                code: enrollment.course.code
            },
            attendance: {
                totalClasses,
                present: presentCount,
                absent: attendances.filter(a => a.status === "absent").length,
                late: attendances.filter(a => a.status === "late").length,
                percentage: attendancePercentage.toFixed(2),
                records: attendances
            },
            grades: {
                entries: grades,
                finalGrade: totalWeightedScore.toFixed(2)
            },
            progress: {
                completedWeeks: courseProgress,
                totalWeeks,
                percentage: progressPercentage.toFixed(2),
                content: courseContent
            }
        };
    }
}