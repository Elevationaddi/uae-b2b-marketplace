import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ErrorBody, ErrorCode } from '@app/contracts';
import type { Request, Response } from 'express';
import { ApiError } from './api-error';

const CODE_FOR_STATUS: Record<number, ErrorCode> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'BAD_REQUEST',
  422: 'VALIDATION_FAILED',
  429: 'RATE_LIMITED',
  503: 'SERVICE_UNAVAILABLE',
};

/** Renders every error in the documented envelope; never leaks internals or stack traces. */
@Catch()
export class ErrorEnvelopeFilter implements ExceptionFilter {
  private readonly logger = new Logger('ErrorEnvelopeFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request & { id?: string }>();
    const res = ctx.getResponse<Response>();
    const requestId = String(req.id ?? 'unknown');

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ErrorCode = 'INTERNAL_ERROR';
    let messageKey = 'common.internal_error';
    let fieldErrors: Record<string, string> | undefined;

    if (exception instanceof ApiError) {
      status = exception.getStatus();
      code = exception.code;
      messageKey = exception.messageKey;
      fieldErrors = exception.fieldErrors;
    } else if (exception instanceof HttpException && exception.getStatus() === 413) {
      status = 422;
      code = 'VALIDATION_FAILED';
      messageKey = 'file.too_large';
      fieldErrors = { file: 'too_large' };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = CODE_FOR_STATUS[status] ?? (status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
      messageKey = `common.${code.toLowerCase()}`;
    } else {
      this.logger.error({ err: exception, request_id: requestId }, 'Unhandled exception');
    }

    const body: ErrorBody = {
      error: {
        code,
        message_key: messageKey,
        request_id: requestId,
        ...(fieldErrors ? { field_errors: fieldErrors } : {}),
      },
    };
    res.status(status).json(body);
  }
}
