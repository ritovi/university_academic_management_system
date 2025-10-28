import { Repository } from "typeorm";
import { AttendanceEntity, AttendanceStatus, ClassMode } from "../../infrastructure/postgres/entities/AttendanceEntity.js";
import { EnrollmentEntity } from "../../infrastructure/postgres/entities/EnrollmentEntity.js";
import { CourseContentEntity } from "../../infrastructure/postgres/entities/CourseContentEntity.js";
import { BulkMarkAttendanceDTO } from "../dtos/AttendanceDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class AttendanceService {
    constructor(
        private readonly attendanceRepository: Repository<AttendanceEntity>,
        private readonly enrollmentRepository: Repository<EnrollmentEntity>,
        private readonly courseContentRepository: Repository<CourseContentEntity>
    ) {}

    async markBulkAttendance(dto: BulkMarkAttendanceDTO, professorId: string, ipAddress: string, classMode: ClassMode) {
        // Verify professor has authority to mark attendance
        const enrollments = await this.enrollmentRepository.find({
            where: { courseId: dto.courseId },
            relations: ["student"]
        });

        if (enrollments.length === 0) {
            throw new AppError("No students enrolled in this course", 404);
        }

        const attendanceRecords = [];

        for (const att of dto.attendances) {
            const attendance = this.attendanceRepository.create({
                studentId: att.studentId,
                courseId: dto.courseId,
                labGroupId: dto.labGroupId ?? undefined,
                classDate: dto.classDate,
                classType: dto.classType,
                status: att.status,
                markedBy: professorId,
                markedAt: new Date(),
                weekNumber: dto.weekNumber,
                professorIpAddress: ipAddress,
                classMode: classMode
            });

            attendanceRecords.push(attendance);
        }

        await this.attendanceRepository.save(attendanceRecords);

        // Update course content as completed
        await this.updateCourseProgress(dto.courseId, dto.weekNumber);

        return {
            message: "Attendance marked successfully",
            count: attendanceRecords.length,
            classMode: classMode,
            professorIP: ipAddress
        };
    }

    async markAllAbsent(courseId: string, labGroupId: string | null, classDate: Date, classType: string, weekNumber: number, professorId: string, ipAddress: string, classMode: ClassMode) {
        const enrollments = await this.enrollmentRepository.find({
            where: labGroupId ? { courseId, labGroupId } : { courseId }
        });

        if (enrollments.length === 0) {
            throw new AppError("No students enrolled", 404);
        }

        const attendanceRecords = enrollments.map(enrollment => 
            this.attendanceRepository.create({
                studentId: enrollment.studentId,
                courseId,
                labGroupId: labGroupId ?? undefined,
                classDate,
                classType: classType as any,
                status: AttendanceStatus.ABSENT,
                markedBy: professorId,
                markedAt: new Date(),
                weekNumber,
                professorIpAddress: ipAddress,
                classMode: classMode,
                notes: "Marked absent - Professor did not arrive within 15 minutes"
            })
        );

        await this.attendanceRepository.save(attendanceRecords);

        return {
            message: "All students marked absent",
            count: attendanceRecords.length,
            classMode: classMode
        };
    }

    private async updateCourseProgress(courseId: string, weekNumber: number) {
        const content = await this.courseContentRepository.findOne({
            where: { courseId, weekNumber }
        });

        if (content && !content.isCompleted) {
            content.isCompleted = true;
            content.completedDate = new Date();
            await this.courseContentRepository.save(content);
        }
    }

    async getStudentAttendance(studentId: string, courseId: string) {
        const attendances = await this.attendanceRepository.find({
            where: { studentId, courseId },
            order: { classDate: "ASC" }
        });

        const totalClasses = attendances.length;
        const presentCount = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
        const absentCount = attendances.filter(a => a.status === AttendanceStatus.ABSENT).length;
        const lateCount = attendances.filter(a => a.status === AttendanceStatus.LATE).length;

        const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

        // Class mode statistics
        const inPersonClasses = attendances.filter(a => a.classMode === ClassMode.IN_PERSON).length;
        const remoteClasses = attendances.filter(a => a.classMode === ClassMode.REMOTE).length;

        return {
            attendances: attendances.map(a => ({
                id: a.id,
                classDate: a.classDate,
                classType: a.classType,
                status: a.status,
                weekNumber: a.weekNumber,
                classMode: a.classMode,
                notes: a.notes
            })),
            summary: {
                totalClasses,
                present: presentCount,
                absent: absentCount,
                late: lateCount,
                attendancePercentage: attendancePercentage.toFixed(2),
                inPersonClasses,
                remoteClasses
            }
        };
    }

    async getCourseAttendanceReport(courseId: string) {
        const attendances = await this.attendanceRepository.find({
            where: { courseId },
            relations: ["student", "student.user"]
        });

        const studentMap = new Map();

        for (const att of attendances) {
            if (!studentMap.has(att.studentId)) {
                studentMap.set(att.studentId, {
                    studentId: att.studentId,
                    studentName: `${att.student.user.name} ${att.student.user.surname}`,
                    present: 0,
                    absent: 0,
                    late: 0,
                    total: 0,
                    inPersonClasses: 0,
                    remoteClasses: 0
                });
            }

            const stats = studentMap.get(att.studentId);
            stats.total++;
            if (att.status === AttendanceStatus.PRESENT) stats.present++;
            if (att.status === AttendanceStatus.ABSENT) stats.absent++;
            if (att.status === AttendanceStatus.LATE) stats.late++;
            if (att.classMode === ClassMode.IN_PERSON) stats.inPersonClasses++;
            if (att.classMode === ClassMode.REMOTE) stats.remoteClasses++;
        }

        const report = Array.from(studentMap.values()).map(stats => ({
            ...stats,
            attendancePercentage: ((stats.present / stats.total) * 100).toFixed(2)
        }));

        return report;
    }
}