import { z } from 'zod';

export const CreateObjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

export const ObjectSchema = CreateObjectSchema.extend({
    id: z.string(),
    imageUrl: z.string().url(),
    createdAt: z.date(),
});

export type CreateObjectDto = z.infer<typeof CreateObjectSchema>;
export type ObjectEntity = z.infer<typeof ObjectSchema>;

export const SOCKET_EVENTS = {
    OBJECT_CREATED: 'object_created',
    OBJECT_DELETED: 'object_deleted',
} as const;
