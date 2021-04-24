/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/valid-params */
import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger: Logger = new Logger(AllExceptionsFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        if (exception instanceof HttpException) {
            this.logger.error(exception.stack);
            super.catch(exception, host);
        } else {
            this.logger.error(exception instanceof Error ? exception.stack : exception);
            super.catch(new HttpException('Internal server error', 500), host);
        }
    }
}
/* eslint-enable promise/valid-params */
/* eslint-enable promise/prefer-await-to-then */
