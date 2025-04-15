import { PrismaClient } from '@prisma/client';

// Define ContractStatus manually if not exported by @prisma/client
type ContractStatus = 'Pending_Approval' | 'Approved' | 'Rejected' | 'Signed' | 'Declined';

export class ContractService {
  constructor(private prisma: PrismaClient) {}

  // Create contract terms for an interview
  async createContractTerms(interviewId: number, contractData: any) {
    return this.prisma.hcmContractTerms.create({
      data: {
        interview_id: interviewId,
        contract_type: contractData.contract_type,
        contract_tenure: contractData.contract_tenure,
        work_hours: contractData.work_hours,
        employment_date: new Date(contractData.employment_date),
        start_date: new Date(contractData.start_date),
        probation: contractData.probation,
        date_of_confirmation: contractData.date_of_confirmation ? new Date(contractData.date_of_confirmation) : null,
        basic_salary_amount: contractData.basic_salary_amount,
        entitlement: contractData.entitlement,
        benefit_type: contractData.benefit_type,
        contract_status: 'Pending_Approval',
      },
    });
  }

  // Update contract status
  async updateContractStatus(contractId: number, status: string) {
    return this.prisma.hcmContractTerms.update({
      where: { id: contractId },
      data: {
        contract_status: status as ContractStatus,
      },
    });
  }

  // Get contract by interview ID
  async getContractByInterviewId(interviewId: number) {
    return this.prisma.hcmContractTerms.findFirst({
      where: {
        interview_id: interviewId,
      },
    });
  }
}
