import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    
    if (error instanceof HttpException) {
      const errorResponse = error.getResponse();
      const message: string | string[] = typeof errorResponse === 'string' ? 
        errorResponse : 
        (errorResponse as { message: string | string[] }).message

      return response.status(error.getStatus()).json({
        data: null,
        error: {
          message
        }
      });
    } else {
      Logger.error('\x1b[31m%s\x1b[0m', 'Unhandled server error:', error);
      return response.status(500).json({
        data: null,
        error: {
          message: 'internal server error'
        }
      });
    }
  }
}