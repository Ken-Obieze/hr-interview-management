import { PrismaClient } from '@prisma/client';
enum InterviewStatus {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
    Rescheduled = 'Rescheduled',
    Cancelled = 'Cancelled',
    Hired = 'Hired',
}
interface InterviewQueryParams {
    search?: string;
    sortBy?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
}

interface VacancyQueryParams extends InterviewQueryParams {
    jobSerialNo: string;
}

export class InterviewService {
    constructor(private prisma: PrismaClient) { }

    // Get Summary Report
    async getSummaryReport() {
        const totalInterviewsSchedule = await this.prisma.hcmInterviews.count();

        const totalAccepted = await this.prisma.hcmInterviews.count({
            where: { interview_status: 'Accepted' },
        });

        const totalRescheduled = await this.prisma.hcmInterviews.count({
            where: { interview_status: 'Rescheduled' },
        });

        // Assumption: Failed invites are those with status 'Rejected' or 'Cancelled'
        const totalFailedInvites = await this.prisma.hcmInterviews.count({
            where: {
                interview_status: {
                    in: ['Rejected', 'Cancelled'],
                },
            },
        });

        return {
            total_interviews_schedule: totalInterviewsSchedule,
            total_accepted: totalAccepted,
            total_rescheduled: totalRescheduled,
            Total_failed_invites: totalFailedInvites,
        };
    }

    // Get All Interviews
    async getAllInterviews(params: InterviewQueryParams) {
        const { search, sortBy, startDate, endDate, page, limit } = params;

        const skip = (page - 1) * limit;

        // Build filter conditions
        const where: any = {};

        if (search) {
            where.OR = [
                { full_name: { contains: search } },
                { role_applied_for: { contains: search } },
                { job_serial_no: { contains: search } },
            ];
        }

        if (startDate && endDate) {
            where.interview_date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            where.interview_date = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            where.interview_date = {
                lte: new Date(endDate),
            };
        }

        // Determine sorting
        const orderBy: any = {};
        if (sortBy === 'created_at_asc') {
            orderBy.created_at = 'asc';
        } else if (sortBy === 'created_at_desc') {
            orderBy.created_at = 'desc';
        } else {
            // Default sorting
            orderBy.created_at = 'desc';
        }

        // Get interviews
        const interviews = await this.prisma.hcmInterviews.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Get total count for pagination
        const total = await this.prisma.hcmInterviews.count({ where });

        return { interviews, total };
    }

    // Get Interview by ID
    async getInterviewById(id: number) {
        return this.prisma.hcmInterviews.findUnique({
            where: { id },
        });
    }

    // Get Interviews by Vacancy
    async getInterviewsByVacancy(params: VacancyQueryParams) {
        const { jobSerialNo, search, sortBy, startDate, endDate, page, limit } = params;

        const skip = (page - 1) * limit;

        // Build filter conditions
        const where: any = {
            job_serial_no: jobSerialNo,
        };

        if (search) {
            where.OR = [
                { full_name: { contains: search } },
                { role_applied_for: { contains: search } },
            ];
        }

        if (startDate && endDate) {
            where.interview_date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            where.interview_date = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            where.interview_date = {
                lte: new Date(endDate),
            };
        }

        // Determine sorting
        const orderBy: any = {};
        if (sortBy === 'created_at_asc') {
            orderBy.created_at = 'asc';
        } else if (sortBy === 'created_at_desc') {
            orderBy.created_at = 'desc';
        } else {
            // Default sorting
            orderBy.created_at = 'desc';
        }

        // Get interviews
        const interviews = await this.prisma.hcmInterviews.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Get total count for pagination
        const total = await this.prisma.hcmInterviews.count({ where });

        return { interviews, total };
    }

    // Create Interview Invite
    async createInterviewInvite(jobApplicationId: string, data: any) {
        // Note: We'd need more details about job application structure
        // This is a simplified implementation
        const interview = await this.prisma.hcmInterviews.create({
            data: {
                job_serial_no: data.job_serial_no || '',
                user_num: data.user_num,
                full_name: data.full_name || '',
                role_applied_for: data.role_applied_for || '',
                interview_date: new Date(data.interview_date),
                interview_time: data.interview_time,
                interview_location: data.interview_location,
                instructions: data.instructions,
                interview_status: 'Pending',
            },
        });

        return interview;
    }

    // Update Interview Status
    async updateInterviewStatus(jobApplicationId: string, userNum: string, status: string) {
        const interviewStatus = status === 'Accepted' ? 'Accepted' : 'Rejected';

        return this.prisma.hcmInterviews.updateMany({
            where: {
                user_num: userNum,
            },
            data: {
                interview_status: interviewStatus,
            },
        });
    }

    // Get Offers Sent
    async getOffersSent(params: InterviewQueryParams) {
        const { search, sortBy, startDate, endDate, page, limit } = params;

        const skip = (page - 1) * limit;

        // Build filter conditions
        const where: any = {
            interview_status: 'Hired',
        };

        if (search) {
            where.OR = [
                { full_name: { contains: search } },
                { role_applied_for: { contains: search } },
                { job_serial_no: { contains: search } },
            ];
        }

        if (startDate && endDate) {
            where.interview_date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            where.interview_date = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            where.interview_date = {
                lte: new Date(endDate),
            };
        }

        // Determine sorting
        const orderBy: any = {};
        if (sortBy === 'created_at_asc') {
            orderBy.created_at = 'asc';
        } else if (sortBy === 'created_at_desc') {
            orderBy.created_at = 'desc';
        } else {
            // Default sorting
            orderBy.created_at = 'desc';
        }

        // Get interviews with contract terms
        const offers = await this.prisma.hcmInterviews.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                contract_terms: true,
            },
        });

        // Get total count for pagination
        const total = await this.prisma.hcmInterviews.count({ where });

        return {
            offers: offers.map((interview: {
                id: number;
                job_serial_no: string;
                full_name: string;
                role_applied_for: string;
                interview_date: Date;
                interview_time: string;
                interview_location: string;
                is_attended: boolean;
                interview_status: string;
                instructions: string;
                created_at: Date;
                contract_terms: any;
            }) => ({
                interview_details: {
                    id: interview.id,
                    job_serial_no: interview.job_serial_no,
                    full_name: interview.full_name,
                    role_applied_for: interview.role_applied_for,
                    interview_date: interview.interview_date,
                    interview_time: interview.interview_time,
                    interview_location: interview.interview_location,
                    is_attended: interview.is_attended,
                    interview_status: interview.interview_status,
                    instructions: interview.instructions,
                    created_at: interview.created_at,
                },
                hcm_contract_terms: interview.contract_terms,
            })),
            total
        };
    }
}
