import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
    Res,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
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

    private getBaseUrl(req: Request): string {
        const protocol = req.protocol;
        const host = req.get('host');
        return `${protocol}://${host}/objects/files`;
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Req() req: Request,
        @Body() dto: CreateObjectDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const imageKey = await this.s3Service.uploadFile(file);
        const object = await this.objectService.create(dto, imageKey);
        
        const baseUrl = this.getBaseUrl(req);
        const fullObject = { ...object, imageUrl: `${baseUrl}/${object.imageUrl}` };
        
        this.objectsGateway.notifyObjectCreated(fullObject);
        return fullObject;
    }

    @Get()
    async findAll(@Req() req: Request) {
        const baseUrl = this.getBaseUrl(req);
        const objects = await this.objectService.findAll();
        return objects.map(obj => ({
            ...obj,
            imageUrl: obj.imageUrl.includes('://') ? obj.imageUrl : `${baseUrl}/${obj.imageUrl}`
        }));
    }

    @Get('files/:key')
    async getFile(@Param('key') key: string, @Res() res: Response) {
        const { stream, contentType } = await this.s3Service.getFile(key);
        res.set('Content-Type', contentType);
        stream.pipe(res);
    }

    @Get(':id')
    async findById(@Req() req: Request, @Param('id') id: string) {
        const object = await this.objectService.findById(id);
        const baseUrl = this.getBaseUrl(req);
        return {
            ...object,
            imageUrl: object.imageUrl.includes('://') ? object.imageUrl : `${baseUrl}/${object.imageUrl}`
        };
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const object = await this.objectService.findById(id);
        const key = object.imageUrl.includes('://') ? object.imageUrl.split('/').pop() : object.imageUrl;
        if (key) {
            await this.s3Service.deleteFile(key);
        }
        await this.objectService.delete(id);
        this.objectsGateway.notifyObjectDeleted(id);
        return { success: true };
    }
}
