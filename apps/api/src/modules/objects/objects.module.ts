import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectController } from './object.controller';
import { ObjectService } from './application/object.service';
import { IObjectRepository } from './domain/object.entity';
import { MongooseObjectRepository } from './infrastructure/mongoose-object.repository';
import { ObjectSchema } from './infrastructure/object.schema';
import { S3Service } from './infrastructure/s3.service';
import { ObjectsGateway } from './infrastructure/objects.gateway';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Object', schema: ObjectSchema }]),
    ],
    controllers: [ObjectController],
    providers: [
        ObjectService,
        S3Service,
        ObjectsGateway,
        {
            provide: IObjectRepository,
            useClass: MongooseObjectRepository,
        },
    ],
})
export class ObjectsModule { }
