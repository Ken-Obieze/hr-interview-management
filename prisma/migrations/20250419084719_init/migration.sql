-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('Pending', 'Accepted', 'Rejected', 'Rescheduled', 'Cancelled', 'Hired');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('Pending_Approval', 'Approved', 'Rejected', 'Signed', 'Declined');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('Permanent', 'Temporary_Intern', 'Contract', 'Consultant');

-- CreateTable
CREATE TABLE "hcm_interviews" (
    "id" SERIAL NOT NULL,
    "job_serial_no" TEXT NOT NULL,
    "user_num" TEXT,
    "full_name" TEXT NOT NULL,
    "role_applied_for" TEXT NOT NULL,
    "interview_date" TIMESTAMP(3) NOT NULL,
    "interview_time" TEXT NOT NULL,
    "interview_location" TEXT NOT NULL,
    "is_attended" BOOLEAN NOT NULL DEFAULT false,
    "interview_status" "InterviewStatus" NOT NULL DEFAULT 'Pending',
    "instructions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hcm_interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcm_interview_attendees" (
    "id" SERIAL NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "attendee_name" TEXT NOT NULL,
    "attendee_email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hcm_interview_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcm_interview_attendee_reports" (
    "id" SERIAL NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "is_interview_hold" TEXT NOT NULL,
    "is_another_interview" TEXT,
    "is_applicant_hired" TEXT NOT NULL,
    "reason_for_another_interview" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hcm_interview_attendee_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcm_contract_terms" (
    "id" SERIAL NOT NULL,
    "interview_id" INTEGER NOT NULL,
    "contract_type" "ContractType" NOT NULL,
    "contract_tenure" TEXT NOT NULL,
    "work_hours" TEXT NOT NULL,
    "employment_date" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "probation" TEXT,
    "date_of_confirmation" TIMESTAMP(3),
    "basic_salary_amount" TEXT NOT NULL,
    "entitlement" TEXT NOT NULL,
    "benefit_type" TEXT,
    "contract_status" "ContractStatus" NOT NULL DEFAULT 'Pending_Approval',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hcm_contract_terms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hcm_interview_attendees" ADD CONSTRAINT "hcm_interview_attendees_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "hcm_interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hcm_interview_attendee_reports" ADD CONSTRAINT "hcm_interview_attendee_reports_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "hcm_interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hcm_contract_terms" ADD CONSTRAINT "hcm_contract_terms_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "hcm_interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
