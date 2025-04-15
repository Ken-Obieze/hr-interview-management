import nodemailer from 'nodemailer';
import { config } from '../config/env';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.EMAIL_SERVICE,
      host: config.EMAIL_HOST,
      port: Number(config.EMAIL_PORT),
      secure: true,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
      },
    });
  }

  // Send interview invite to applicant
  async sendInterviewInvite(interviewData: any) {
    // Placeholder for actual email address
    const to = 'applicant@example.com';
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to,
      subject: 'Interview Invitation',
      html: `
        <h1>Interview Invitation</h1>
        <p>Dear ${interviewData.full_name},</p>
        <p>You have been invited for an interview for the role of ${interviewData.role_applied_for}.</p>
        <p><strong>Date:</strong> ${interviewData.interview_date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${interviewData.interview_time}</p>
        <p><strong>Location:</strong> ${interviewData.interview_location}</p>
        <p><strong>Instructions:</strong> ${interviewData.instructions || 'None'}</p>
        <p>Please confirm your attendance by clicking on one of the links below:</p>
        <p>
          <a href="https://example.com/api/v1/interviews/${interviewData.id}/${interviewData.user_num}/Accepted">Accept</a> |
          <a href="https://example.com/api/v1/interviews/${interviewData.id}/${interviewData.user_num}/Rejected">Decline</a>
        </p>
        <p>Thank you!</p>
      `,
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send email to internal attendees
  async sendInternalInvite(interviewData: any, attendee: any) {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: attendee.attendee_email,
      subject: 'Interview Panel Invitation',
      html: `
        <h1>Interview Panel Invitation</h1>
        <p>Dear ${attendee.attendee_name},</p>
        <p>You have been invited to be part of the interview panel for ${interviewData.full_name}.</p>
        <p><strong>Role:</strong> ${interviewData.role_applied_for}</p>
        <p><strong>Date:</strong> ${interviewData.interview_date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${interviewData.interview_time}</p>
        <p><strong>Location:</strong> ${interviewData.interview_location}</p>
        <p>Please make sure to be available at the specified time.</p>
        <p>Thank you!</p>
      `,
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send interview report to management
  async sendInterviewReport(interviewData: any, reportData: any) {
    // Placeholder for management email
    const to = 'management@example.com';
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to,
      subject: 'Interview Report',
      html: `
        <h1>Interview Report</h1>
        <p><strong>Candidate:</strong> ${interviewData.full_name}</p>
        <p><strong>Role:</strong> ${interviewData.role_applied_for}</p>
        <p><strong>Interview Date:</strong> ${interviewData.interview_date.toLocaleDateString()}</p>
        <p><strong>Interview Held:</strong> ${reportData.is_interview_hold}</p>
        <p><strong>Another Interview Required:</strong> ${reportData.is_another_interview || 'No'}</p>
        <p><strong>Applicant Hired:</strong> ${reportData.is_applicant_hired}</p>
        ${reportData.reason_for_another_interview ? `<p><strong>Reason for Another Interview:</strong> ${reportData.reason_for_another_interview}</p>` : ''}
        ${reportData.description ? `<p><strong>Additional Comments:</strong> ${reportData.description}</p>` : ''}
        <p>Thank you!</p>
      `,
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send contract terms to management
  async sendContractTerms(interviewData: any, contractData: any) {
    // Placeholder for management email
    const to = 'management@example.com';
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to,
      subject: 'Contract Terms for Approval',
      html: `
        <h1>Contract Terms for Approval</h1>
        <p><strong>Candidate:</strong> ${interviewData.full_name}</p>
        <p><strong>Role:</strong> ${interviewData.role_applied_for}</p>
        <p><strong>Contract Type:</strong> ${contractData.contract_type}</p>
        <p><strong>Contract Tenure:</strong> ${contractData.contract_tenure}</p>
        <p><strong>Work Hours:</strong> ${contractData.work_hours}</p>
        <p><strong>Employment Date:</strong> ${contractData.employment_date.toLocaleDateString()}</p>
        <p><strong>Start Date:</strong> ${contractData.start_date.toLocaleDateString()}</p>
        <p><strong>Probation:</strong> ${contractData.probation || 'None'}</p>
        <p><strong>Date of Confirmation:</strong> ${contractData.date_of_confirmation ? contractData.date_of_confirmation.toLocaleDateString() : 'N/A'}</p>
        <p><strong>Basic Salary Amount:</strong> ${contractData.basic_salary_amount}</p>
        <p><strong>Entitlement:</strong> ${contractData.entitlement}</p>
        <p><strong>Benefits:</strong> ${contractData.benefit_type || 'None'}</p>
        <p>Please review and approve these contract terms.</p>
        <p>Thank you!</p>
      `,
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
