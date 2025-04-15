import { PrismaClient } from '@prisma/client';

export class ReportService {
  constructor(private prisma: PrismaClient) {}

  // Create report for an interview
  async createReport(interviewId: number, reportData: any) {
    return this.prisma.hcmInterviewAttendeeReports.create({
      data: {
        interview_id: interviewId,
        is_interview_hold: reportData.is_interview_hold,
        is_another_interview: reportData.is_another_interview,
        is_applicant_hired: reportData.is_applicant_hired,
        reason_for_another_interview: reportData.reason_for_another_interview,
        description: reportData.description,
      },
    });
  }

  // Get reports by interview ID
  async getReportsByInterviewId(interviewId: number) {
    return this.prisma.hcmInterviewAttendeeReports.findMany({
      where: {
        interview_id: interviewId,
      },
    });
  }
}
