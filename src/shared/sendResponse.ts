import { Response } from "express";

interface IApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
}

const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  res.status(data?.statusCode).json({
    success: true,
    message: data?.message,
    data: data?.data ?? null,
  });
};

export default sendResponse;