import { Router } from 'express';
import attendeeController from '../controllers/attendeeController';
import { validate, internalInviteSchema } from '../middlewares/validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/send-internal-invite:
 *   post:
 *     summary: Send Invite to Internal Invitees
 *     description: Send email notifications to staff that will be present for the interview
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
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 attendee_name:
 *                   type: string
 *                 attendee_email:
 *                   type: string
 *                   format: email
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/:interview_id/send-internal-invite',
  authenticate,
  validate(internalInviteSchema),
  attendeeController.sendInternalInvite
);

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/attendees:
 *   get:
 *     summary: Get Internal Invitees
 *     description: Fetch the list of all internal invitees (staff) for the interview
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
  '/:interview_id/attendees',
  authenticate,
  attendeeController.getInternalInvitees
);

export default router;
