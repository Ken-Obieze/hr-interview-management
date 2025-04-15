import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { AttendeeService } from '../services/attendeeService';
import { EmailService } from '../services/emailService';
import { InterviewService } from '../services/interviewService';

const prisma = new PrismaClient();
const attendeeService = new AttendeeService(prisma);
const interviewService = new InterviewService(prisma);
const emailService = new EmailService();

export class AttendeeController {
  // Send Invite to Internal Invitees
  async sendInternalInvite(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      const attendeesData = req.body;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      // Create attendees
      const savedAttendees = await attendeeService.createAttendees(
        Number(interview_id),
        attendeesData
      );
      
      // Send email notifications to attendees
      for (const attendee of savedAttendees) {
        await emailService.sendInternalInvite(interview, attendee);
      }
      
      return successResponse(
        res, 
        'Interview Invite has been sent to the selected persons', 
        savedAttendees
      );
    } catch (error) {
      console.error('Error sending internal invite:', error);
      return errorResponse(res);
    }
  }

  // Get Internal Invitees
  async getInternalInvitees(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      const attendees = await attendeeService.getAttendeesByInterviewId(Number(interview_id));
      
      return successResponse(res, 'List of attendees returned successfully', attendees);
    } catch (error) {
      console.error('Error getting internal invitees:', error);
      return errorResponse(res);
    }
  }
}

export default new AttendeeController();
