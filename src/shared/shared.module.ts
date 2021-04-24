import { Module } from '@nestjs/common';
import { MongoQueryValidationPipe } from './pipes/mongo-query-validation.pipe';
import { ObjectIdTransformPipe } from './pipes/object-id-transform.pipe';
import { AppConfigService } from './services/app-config.service';

@Module({
    providers: [AppConfigService, ObjectIdTransformPipe, MongoQueryValidationPipe],
    exports: [AppConfigService, ObjectIdTransformPipe, MongoQueryValidationPipe],
})
export class SharedModule {}
