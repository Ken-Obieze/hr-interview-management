import { Router } from 'express';
import contractController from '../controllers/contractController';
import { validate, contractTermsSchema, contractProcessSchema } from '../middlewares/validators';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/submit-contract-term:
 *   post:
 *     summary: Submit Contract Terms of Engagement
 *     description: Create the contract terms for the staff
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
 *               contract_type:
 *                 type: string
 *               contract_tenure:
 *                 type: string
 *               work_hours:
 *                 type: string
 *               employment_date:
 *                 type: string
 *                 format: date
 *               start_date:
 *                 type: string
 *                 format: date
 *               probation:
 *                 type: string
 *               date_of_confirmation:
 *                 type: string
 *                 format: date
 *               basic_salary_amount:
 *                 type: string
 *               entitlement:
 *                 type: string
 *                 enum: [Yes, No]
 *               benefit_type:
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
  '/:interview_id/submit-contract-term',
  authenticate,
  validate(contractTermsSchema),
  contractController.submitContractTerms
);

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/contract-term:
 *   post:
 *     summary: Process Contract Terms of Engagement
 *     description: Process the submitted contract terms
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
 *               contract_id:
 *                 type: integer
 *               contract_status:
 *                 type: string
 *                 enum: [Pending_Approval, Approved, Rejected, Signed, Declined]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/:interview_id/contract-term',
  authenticate,
  validate(contractProcessSchema),
  contractController.processContractTerms
);

/**
 * @swagger
 * /api/v1/interviews/{interview_id}/contract-terms:
 *   get:
 *     summary: Get Single Contract Terms of Engagement for an Interview
 *     description: Get the Contract Terms for a specific interview
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
  '/:interview_id/contract-terms',
  authenticate,
  contractController.getContractTerms
);

export default router;
