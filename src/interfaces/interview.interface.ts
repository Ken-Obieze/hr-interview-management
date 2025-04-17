import { Request, Response } from "express"

export default interface InterviewInterface {
    getSummaryReport(req: Request, res: Response): Promise<Response>,
    getAllInterviews(req: Request, res: Response): Promise<Response>,
    getSingleInterview(req: Request, res: Response): Promise<Response>,
    getScheduledInterviesToVacancy(req: Request, res: Response): Promise<Response>,
    sendInterviewToApplicant(req: Request, res: Response): Promise<Response>,
    processInterviewRequest(req: Request, res: Response): Promise<Response>,
    sendInvitesToInternal(req: Request, res: Response): Promise<Response>,
    getInternalInvites(req: Request, res: Response): Promise<Response>,
    submitInterviewReport(req: Request, res: Response): Promise<Response>,
    getInterviewReport(req: Request, res: Response): Promise<Response>,
    submitContractTerms(req: Request, res: Response): Promise<Response>,
    processContractTerms(req: Request, res: Response): Promise<Response>,
    getSingleContract(req: Request, res: Response): Promise<Response>,
    getOfferList(req: Request, res: Response): Promise<Response>,
}