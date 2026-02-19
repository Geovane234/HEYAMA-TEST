import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectService } from './application/object.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Service } from './infrastructure/s3.service';
import { ObjectsGateway } from './infrastructure/objects.gateway';

@Controller('objects')
export class ObjectController {
    constructor(
        private readonly objectService: ObjectService,
        private readonly s3Service: S3Service,
        private readonly objectsGateway: ObjectsGateway,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() dto: CreateObjectDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const imageUrl = await this.s3Service.uploadFile(file);
        const object = await this.objectService.create(dto, imageUrl);
        this.objectsGateway.notifyObjectCreated(object);
        return object;
    }

    @Get()
    async findAll() {
        return this.objectService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.objectService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const object = await this.objectService.findById(id);
        await this.s3Service.deleteFile(object.imageUrl);
        await this.objectService.delete(id);
        this.objectsGateway.notifyObjectDeleted(id);
        return { success: true };
    }
}
