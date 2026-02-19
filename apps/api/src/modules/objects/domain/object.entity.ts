export class ObjectEntity {
    id!: string;
    title!: string;
    description!: string;
    imageUrl!: string;
    createdAt!: Date;

    constructor(partial: Partial<ObjectEntity>) {
        Object.assign(this, partial);
    }
}

export abstract class IObjectRepository {
    abstract create(object: Partial<ObjectEntity>): Promise<ObjectEntity>;
    abstract findAll(): Promise<ObjectEntity[]>;
    abstract findById(id: string): Promise<ObjectEntity | null>;
    abstract delete(id: string): Promise<void>;
}
