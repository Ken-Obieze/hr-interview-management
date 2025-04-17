import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { errorResponse } from '../utils/responseHandler';

export const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      errorResponse(res, errorMessage, 400);
    }

    next();
  };
};

// Interview validation schemas
export const interviewInviteSchema = Joi.array().items(
  Joi.object({
    user_num: Joi.string().required(),
    interview_date: Joi.date().iso().required(),
    interview_time: Joi.string().required(),
    interview_location: Joi.string().required(),
    instructions: Joi.string().allow(null, ''),
  })
);

export const internalInviteSchema = Joi.array().items(
  Joi.object({
    attendee_name: Joi.string().required(),
    attendee_email: Joi.string().email().required(),
  })
);

export const interviewReportSchema = Joi.object({
  is_interview_hold: Joi.string().valid('Yes', 'No').required(),
  is_another_interview: Joi.string().valid('Yes', 'No', '').allow(null),
  is_applicant_hired: Joi.string().valid('Yes', 'No').required(),
  reason_for_another_interview: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
});

export const contractTermsSchema = Joi.object({
  contract_type: Joi.string().required(),
  contract_tenure: Joi.string().required(),
  work_hours: Joi.string().required(),
  employment_date: Joi.date().iso().required(),
  start_date: Joi.date().iso().required(),
  probation: Joi.string().allow(null, ''),
  date_of_confirmation: Joi.date().iso().allow(null),
  basic_salary_amount: Joi.string().required(),
  entitlement: Joi.string().valid('Yes', 'No').required(),
  benefit_type: Joi.string().allow(null, ''),
});

export const contractProcessSchema = Joi.object({
  contract_id: Joi.number().required(),
  contract_status: Joi.string()
    .valid('Pending_Approval', 'Approved', 'Rejected', 'Signed', 'Declined')
    .required(),
});
