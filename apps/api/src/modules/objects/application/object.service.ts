import { Injectable, NotFoundException } from '@nestjs/common';
import { IObjectRepository, ObjectEntity } from '../domain/object.entity';
import { CreateObjectDto } from '../dto/create-object.dto';

@Injectable()
export class ObjectService {
    constructor(private readonly objectRepository: IObjectRepository) { }

    async create(dto: CreateObjectDto, imageUrl: string): Promise<ObjectEntity> {
        return this.objectRepository.create({
            ...dto,
            imageUrl,
            createdAt: new Date(),
        });
    }

    async findAll(): Promise<ObjectEntity[]> {
        return this.objectRepository.findAll();
    }

    async findById(id: string): Promise<ObjectEntity> {
        const object = await this.objectRepository.findById(id);
        if (!object) {
            throw new NotFoundException(`Object with ID ${id} not found`);
        }
        return object;
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        return this.objectRepository.delete(id);
    }
}
