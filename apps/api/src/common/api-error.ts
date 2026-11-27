import { HttpException } from '@nestjs/common';
import { HTTP_STATUS_FOR_ERROR, type ErrorCode } from '@app/contracts';

/** Domain error carrying a documented error code and translation key. */
export class ApiError extends HttpException {
  constructor(
    public readonly code: ErrorCode,
    public readonly messageKey: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(messageKey, HTTP_STATUS_FOR_ERROR[code]);
  }
}
