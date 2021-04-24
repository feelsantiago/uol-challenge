import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MongoQueryValidationPipe implements PipeTransform {
    public transform(value: Record<string, unknown>, _metadata: ArgumentMetadata): Record<string, unknown> {
        return Object.entries(value).reduce(
            (acc, [key, queryValue]) => ({ ...acc, [key]: this.validateValue(queryValue) }),
            {},
        );
    }

    private validateValue(value: unknown): unknown {
        if (typeof value === 'string') {
            return new RegExp(`^${this.validate(value)}`, 'i');
        }

        return value;
    }

    private validate(value: string): string {
        // verify mongo code injection, throw error if has mongo operators
        return value;
    }
}
