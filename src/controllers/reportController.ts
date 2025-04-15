import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { ReportService } from '../services/reportService';
import { InterviewService } from '../services/interviewService';
import { EmailService } from '../services/emailService';

const prisma = new PrismaClient();
const reportService = new ReportService(prisma);
const interviewService = new InterviewService(prisma);
const emailService = new EmailService();

export class ReportController {
  // Submit Interview Report
  async submitInterviewReport(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      const reportData = req.body;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      // Create report
      const report = await reportService.createReport(Number(interview_id), reportData);
      
      // Update interview status to Hired if applicable
      if (reportData.is_applicant_hired === 'Yes') {
        await prisma.hcmInterviews.update({
          where: { id: Number(interview_id) },
          data: { interview_status: 'Hired' },
        });
      }
      
      // Send email notification to management
      await emailService.sendInterviewReport(interview, report);
      
      return successResponse(res, 'Interview report submitted successfully', report, 201);
    } catch (error) {
      console.error('Error submitting interview report:', error);
      return errorResponse(res);
    }
  }

  // Get Interview Reports
  async getInterviewReports(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      const reports = await reportService.getReportsByInterviewId(Number(interview_id));
      
      return successResponse(res, 'Records fetched successfully', reports);
    } catch (error) {
      console.error('Error getting interview reports:', error);
      return errorResponse(res);
    }
  }
}

export default new ReportController();
