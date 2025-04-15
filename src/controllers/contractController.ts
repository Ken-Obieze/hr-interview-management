import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { ContractService } from '../services/contractService';
import { InterviewService } from '../services/interviewService';
import { EmailService } from '../services/emailService';

const prisma = new PrismaClient();
const contractService = new ContractService(prisma);
const interviewService = new InterviewService(prisma);
const emailService = new EmailService();

export class ContractController {
  // Submit Contract Terms of Engagement
  async submitContractTerms(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      const contractData = req.body;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      // Create contract terms
      const contract = await contractService.createContractTerms(
        Number(interview_id),
        contractData
      );
      
      // Send email notification to management
      await emailService.sendContractTerms(interview, contract);
      
      return successResponse(res, 'Contract terms submitted successfully', contract, 201);
    } catch (error) {
      console.error('Error submitting contract terms:', error);
      return errorResponse(res);
    }
  }

  // Process Contract Terms of Engagement
  async processContractTerms(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      const { contract_id, contract_status } = req.body;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      // Update contract status
      const contract = await contractService.updateContractStatus(
        contract_id,
        contract_status
      );
      
      return successResponse(res, 'Contract terms processed successfully', contract);
    } catch (error) {
      console.error('Error processing contract terms:', error);
      return errorResponse(res);
    }
  }

  // Get Single Contract Terms of Engagement for an Interview
  async getContractTerms(req: Request, res: Response) {
    try {
      const { interview_id } = req.params;
      
      // Validate if interview exists
      const interview = await interviewService.getInterviewById(Number(interview_id));
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404);
      }
      
      const contract = await contractService.getContractByInterviewId(Number(interview_id));
      
      if (!contract) {
        return errorResponse(res, 'Contract terms not found for this interview', 404);
      }
      
      return successResponse(res, 'Contract terms retrieved successfully', contract);
    } catch (error) {
      console.error('Error getting contract terms:', error);
      return errorResponse(res);
    }
  }
}

export default new ContractController();
