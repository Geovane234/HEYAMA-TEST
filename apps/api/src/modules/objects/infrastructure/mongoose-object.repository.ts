import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IObjectRepository, ObjectEntity } from '../domain/object.entity';
import { ObjectDocument } from './object.schema';

@Injectable()
export class MongooseObjectRepository implements IObjectRepository {
    constructor(
        @InjectModel('Object') private readonly objectModel: Model<ObjectDocument>,
    ) { }

    async create(object: Partial<ObjectEntity>): Promise<ObjectEntity> {
        const created = new this.objectModel(object);
        const doc = await created.save();
        return this.toEntity(doc);
    }

    async findAll(): Promise<ObjectEntity[]> {
        const docs = await this.objectModel.find().sort({ createdAt: -1 }).exec();
        return docs.map((doc) => this.toEntity(doc));
    }

    async findById(id: string): Promise<ObjectEntity | null> {
        const doc = await this.objectModel.findById(id).exec();
        if (!doc) return null;
        return this.toEntity(doc);
    }

    async delete(id: string): Promise<void> {
        await this.objectModel.findByIdAndDelete(id).exec();
    }

    private toEntity(doc: ObjectDocument): ObjectEntity {
        return new ObjectEntity({
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            imageUrl: doc.imageUrl,
            createdAt: (doc as any).createdAt,
        });
    }
}
