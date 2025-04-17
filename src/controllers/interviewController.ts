import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { InterviewService } from '../services/interviewService';
import { EmailService } from '../services/emailService';
import { PaginationService } from '../services/paginationService';

const prisma = new PrismaClient();
const interviewService = new InterviewService(prisma);
const emailService = new EmailService();
const paginationService = new PaginationService();

export class InterviewController {
  // Get Overview Summary Report
  async getSummaryReport(req: Request, res: Response) {
    try {
      const summary = await interviewService.getSummaryReport();
      successResponse(res, 'Summary Report on Interview', summary);
    } catch (error) {
      console.error('Error getting summary report:', error);
      errorResponse(res);
    }
  }

  // Get List of All Interviews
  async getAllInterviews(req: Request, res: Response) {
    try {
      const { search, sort_by, start_date, end_date, page = 1, limit = 10 } = req.query;
      
      const { interviews, total } = await interviewService.getAllInterviews({
        search: search as string,
        sortBy: sort_by as string,
        startDate: start_date as string,
        endDate: end_date as string,
        page: Number(page),
        limit: Number(limit),
      });

      const pagination = paginationService.getPaginationInfo({
        total,
        page: Number(page),
        limit: Number(limit),
      });

      successResponse(res, 'Record returned', interviews, 200, pagination);
    } catch (error) {
      console.error('Error getting interviews:', error);
      errorResponse(res);
    }
  }

  // Get Single Interview Details
  async getInterviewById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const interview = await interviewService.getInterviewById(Number(id));
      
      if (!interview) {
        errorResponse(res, 'Interview not found', 404);
      }
      
      successResponse(res, 'Record returned', interview);
    } catch (error) {
      console.error('Error getting interview:', error);
      errorResponse(res);
    }
  }

  // Get Scheduled Interviews Tied to Vacancy
  async getInterviewsByVacancy(req: Request, res: Response) {
    try {
      const { job_serial_no } = req.params;
      const { search, sort_by, start_date, end_date, page = 1, limit = 10 } = req.query;
      
      const { interviews, total } = await interviewService.getInterviewsByVacancy({
        jobSerialNo: job_serial_no,
        search: search as string,
        sortBy: sort_by as string,
        startDate: start_date as string,
        endDate: end_date as string,
        page: Number(page),
        limit: Number(limit),
      });

      const pagination = paginationService.getPaginationInfo({
        total,
        page: Number(page),
        limit: Number(limit),
      });

      successResponse(res, 'Record returned', interviews, 200, pagination);
    } catch (error) {
      console.error('Error getting interviews by vacancy:', error);
      errorResponse(res);
    }
  }

  // Send Interview Invite to Applicant
  async sendInterviewInvite(req: Request, res: Response) {
    try {
      const { job_application_id } = req.params;
      const inviteData = req.body;
      
      const savedInvite = await interviewService.createInterviewInvite(
        job_application_id,
        inviteData
      );
      
      // Send email notification to applicant
      await emailService.sendInterviewInvite(savedInvite);
      
      successResponse(res, 'Interview Invite has been sent', savedInvite);
    } catch (error) {
      console.error('Error sending interview invite:', error);
      errorResponse(res);
    }
  }

  // Process Invitation Request
  async processInvitationRequest(req: Request, res: Response) {
    try {
      const { job_application_id, user_num, status } = req.params;
      
      await interviewService.updateInterviewStatus(job_application_id, user_num, status);
      
      successResponse(res, 'Interview invitation response has been submitted.', {});
    } catch (error) {
      console.error('Error processing invitation:', error);
      errorResponse(res);
    }
  }

  // Get the List of Offers Sent
  async getOffersSent(req: Request, res: Response) {
    try {
      const { search, sort_by, start_date, end_date, page = 1, limit = 10 } = req.query;
      
      const { offers, total } = await interviewService.getOffersSent({
        search: search as string,
        sortBy: sort_by as string,
        startDate: start_date as string,
        endDate: end_date as string,
        page: Number(page),
        limit: Number(limit),
      });

      const pagination = paginationService.getPaginationInfo({
        total,
        page: Number(page),
        limit: Number(limit),
      });

      successResponse(
        res, 
        'Records returned', 
        offers, 
        200, 
        pagination
      );
    } catch (error) {
      console.error('Error getting offers:', error);
      errorResponse(res);
    }
  }
}

export const interviewController = new InterviewController();
