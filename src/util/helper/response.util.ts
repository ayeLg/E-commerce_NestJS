import { Response } from 'express';

export const successResponse = (
  res: Response,
  message: string,
  data: {} | [] = [],
  title: string = 'Success',
  meta: {} = {},
): void => {
  res.status(200).json({
    error: false,
    authorized: true,
    message,
    title,
    data,
    meta,
  });
};

export const errorResponse = (
  res: Response,
  message: string | object,
  statusCode: number = 400,
  authorized: boolean = true,
  title: string = 'Error',
  subscribe: boolean = false,
  register: boolean = false,
): void => {
  res.status(statusCode).json({
    error: true,
    authorized,
    message,
    title,
    subscribe,
    register,
  });
};
