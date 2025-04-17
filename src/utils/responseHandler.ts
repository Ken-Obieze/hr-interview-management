import { Response } from 'express';

interface PaginationInfo {
  total: number;
  current: number;
  from: number;
  to: number;
  pages: number;
}

export const successResponse = (
  res: Response,
  message: string,
  data: any,
  statusCode = 200,
  pagination?: PaginationInfo
) => {
  const response: Record<string, any> = {
    status: 'success',
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message = 'Sorry, unable to complete the operation. Please, try again',
  statusCode = 500
) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
  });
};
