import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class S3Service {
    private s3Client: S3Client | null = null;
    private bucketName: string;
    private readonly logger = new Logger(S3Service.name);
    private readonly isLocalMode: boolean;

    constructor() {
        const endpoint = process.env.S3_ENDPOINT;
        const accessKeyId = process.env.S3_ACCESS_KEY_ID;

        // Detect if we should use local mode (missing endpoint or placeholder values)
        this.isLocalMode = !endpoint || endpoint.includes('your-r2-id') || !accessKeyId || accessKeyId === 'your-access-key';

        if (!this.isLocalMode) {
            this.s3Client = new S3Client({
                region: process.env.S3_REGION || 'auto',
                endpoint: endpoint,
                credentials: {
                    accessKeyId: accessKeyId!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                },
            });
        } else {
            this.logger.warn('S3 configuration missing or using placeholders. Falling back to LOCAL STORAGE.');
        }
        this.bucketName = process.env.S3_BUCKET_NAME || 'uploads';
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `${uuidv4()}-${file.originalname}`;

        if (this.isLocalMode) {
            return this.saveLocally(file.buffer, key);
        }

        try {
            await this.s3Client!.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );
            return `${process.env.S3_PUBLIC_URL}/${key}`;
        } catch (error) {
            this.logger.error(`S3 upload failed: ${error.message}. Falling back to local storage.`);
            return this.saveLocally(file.buffer, key);
        }
    }

    private saveLocally(buffer: Buffer, key: string): string {
        const uploadDir = join(process.cwd(), 'uploads');
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = join(uploadDir, key);
        writeFileSync(filePath, buffer);

        return `/uploads/${key}`;
    }

    async deleteFile(url: string): Promise<void> {
        const key = url.split('/').pop();
        if (!key) return;

        if (this.isLocalMode || url.includes('/uploads/')) {
            // Local deletion could be implemented here if needed
            return;
        }

        try {
            await this.s3Client?.send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                }),
            );
        } catch (error) {
            this.logger.error(`S3 delete failed: ${error.message}`);
        }
    }
}
