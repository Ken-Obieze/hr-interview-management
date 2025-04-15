import { Router } from 'express';
import InterviewController from '../controllers/interviewController';
import { validate, interviewInviteSchema } from '../middlewares/validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/interviews/summary:
 *   get:
 *     summary: Get Overview Summary Report
 *     description: Fetch summary report on interviews
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
router.get('/summary', authenticate, InterviewController.getSummaryReport);
// router.get('/summary', authenticate, InterviewController.getSummaryReport);

/**
 * @swagger
 * /api/v1/interviews:
 *   get:
 *     summary: Get List of All Interviews
 *     description: Fetch the list of all the applicants that have been scheduled for an interview or interviewed
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Keyword search
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *         description: Sort by created_at (asc/desc)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, InterviewController.getAllInterviews);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   get:
 *     summary: Get Single Interview Details
 *     description: Get interview detail using id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, InterviewController.getInterviewById);

/**
 * @swagger
 * /api/v1/interviews/vacancy/{job_serial_no}:
 *   get:
 *     summary: Get Scheduled Interviews Tied to Vacancy
 *     description: Get the list of all interviews that is tied to a specific vacancy
 *     parameters:
 *       - in: path
 *         name: job_serial_no
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Serial Number
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
router.get('/vacancy/:job_serial_no', authenticate, InterviewController.getInterviewsByVacancy);

/**
 * @swagger
 * /api/v1/interviews/application/{job_application_id}/send-invite:
 *   post:
 *     summary: Send Interview Invite to Applicant
 *     description: Send an invite to the applicant(s) that has/have submitted an application and qualifies for the next stage
 *     parameters:
 *       - in: path
 *         name: job_application_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 user_num:
 *                   type: string
 *                 interview_date:
 *                   type: string
 *                   format: date
 *                 interview_time:
 *                   type: string
 *                 interview_location:
 *                   type: string
 *                 instructions:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/application/:job_application_id/send-invite',
  authenticate,
  validate(interviewInviteSchema),
  InterviewController.sendInterviewInvite
);

/**
 * @swagger
 * /api/v1/interviews/{job_application_id}/{user_num}/{status}:
 *   get:
 *     summary: Process Invitation Request
 *     description: For applicants to accept or reject interview invitations
 *     parameters:
 *       - in: path
 *         name: job_application_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Application ID
 *       - in: path
 *         name: user_num
 *         required: true
 *         schema:
 *           type: string
 *         description: User Number
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Accepted, NotAccepted]
 *         description: Status (Accepted or NotAccepted)
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
router.get(
  '/:job_application_id/:user_num/:status',
  InterviewController.processInvitationRequest
);

/**
 * @swagger
 * /api/v1/interviews/offers:
 *   get:
 *     summary: Get the List of Offers Sent
 *     description: Pull the list of interviews where interview_status is Hired alongside with the related contract_terms
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
router.get('/offers', authenticate, InterviewController.getOffersSent);

export default router;
