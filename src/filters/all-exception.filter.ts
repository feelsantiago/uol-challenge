/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/valid-params */
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    public catch(exception: unknown, host: ArgumentsHost): void {
        if (exception instanceof HttpException) {
            super.catch(exception, host);
        } else {
            const message = exception instanceof Error ? exception.message : 'Internal Server Error';
            super.catch(new HttpException(message, 500), host);
        }
    }
}
/* eslint-enable promise/valid-params */
/* eslint-enable promise/prefer-await-to-then */
