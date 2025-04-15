import { Router } from 'express';
import ReportController from '../controllers/reportController';
import { validate, interviewReportSchema } from '../middlewares/validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/submit-interview-report:
 *   post:
 *     summary: Submit Interview Report
 *     description: Submit the report of the interview
 *     parameters:
 *       - in: path
 *         name: interview_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_interview_hold:
 *                 type: string
 *                 enum: [Yes, No]
 *               is_another_interview:
 *                 type: string
 *                 enum: [Yes, No]
 *               is_applicant_hired:
 *                 type: string
 *                 enum: [Yes, No]
 *               reason_for_another_interview:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/:interview_id/submit-interview-report',
  authenticate,
  validate(interviewReportSchema),
  ReportController.submitInterviewReport
);

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/submitted-reports:
 *   get:
 *     summary: Get Interview Report
 *     description: Get the list of submitted interview reports per interview
 *     parameters:
 *       - in: path
 *         name: interview_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
router.get(
  '/:interview_id/submitted-reports',
  authenticate,
  ReportController.getInterviewReports
);

export default router;
