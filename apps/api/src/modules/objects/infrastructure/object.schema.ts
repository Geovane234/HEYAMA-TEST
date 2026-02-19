import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ObjectDocument extends Document {
    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    imageUrl!: string;
}

export const ObjectSchema = SchemaFactory.createForClass(ObjectDocument);
