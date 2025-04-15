import { PrismaClient } from '@prisma/client';

export class AttendeeService {
  constructor(private prisma: PrismaClient) {}

  // Create attendees for an interview
  async createAttendees(interviewId: number, attendeesData: any[]) {
    const createdAttendees = [];
    
    for (const attendee of attendeesData) {
      const createdAttendee = await this.prisma.hcmInterviewAttendees.create({
        data: {
          interview_id: interviewId,
          attendee_name: attendee.attendee_name,
          attendee_email: attendee.attendee_email,
        },
      });
      
      createdAttendees.push(createdAttendee);
    }
    
    return createdAttendees;
  }

  // Get attendees by interview ID
  async getAttendeesByInterviewId(interviewId: number) {
    return this.prisma.hcmInterviewAttendees.findMany({
      where: {
        interview_id: interviewId,
      },
    });
  }
}
