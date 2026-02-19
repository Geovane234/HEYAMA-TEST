import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { 
    S3Client, 
    PutObjectCommand, 
    DeleteObjectCommand, 
    HeadBucketCommand, 
    CreateBucketCommand,
    PutBucketPolicyCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class S3Service implements OnModuleInit {
    private s3Client: S3Client;
    private bucketName: string;
    private readonly logger = new Logger(S3Service.name);

    constructor() {
        const endpoint = process.env.S3_ENDPOINT;
        const accessKeyId = process.env.S3_ACCESS_KEY_ID;
        const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
        this.bucketName = process.env.S3_BUCKET_NAME || 'heyama-test';

        this.s3Client = new S3Client({
            region: process.env.S3_REGION || 'us-east-1',
            endpoint: endpoint,
            credentials: {
                accessKeyId: accessKeyId!,
                secretAccessKey: secretAccessKey!,
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    async onModuleInit() {
        await this.ensureBucketExists();
        await this.setPublicPolicy();
    }

    private async ensureBucketExists() {
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
        } catch (error) {
            this.logger.log(`Bucket ${this.bucketName} does not exist. Creating...`);
            try {
                await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
                this.logger.log(`Bucket ${this.bucketName} created successfully.`);
            } catch (createError) {
                this.logger.error(`Failed to create bucket ${this.bucketName}: ${createError.message}`);
            }
        }
    }

    private async setPublicPolicy() {
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                },
            ],
        };

        try {
            await this.s3Client.send(
                new PutBucketPolicyCommand({
                    Bucket: this.bucketName,
                    Policy: JSON.stringify(policy),
                }),
            );
            this.logger.log(`Public access policy set for bucket ${this.bucketName}`);
        } catch (error) {
            this.logger.error(`Failed to set public access policy: ${error.message}`);
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `${uuidv4()}-${file.originalname}`;

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );
            return key; 
        } catch (error) {
            this.logger.error(`MinIO upload failed: ${error.message}`);
            throw error;
        }
    }

    async getFile(key: string): Promise<{ stream: Readable; contentType: string }> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const response = await this.s3Client.send(command);
            return {
                stream: response.Body as Readable,
                contentType: response.ContentType || 'application/octet-stream',
            };
        } catch (error) {
            this.logger.error(`Failed to get file ${key}: ${error.message}`);
            throw error;
        }
    }

    async deleteFile(key: string): Promise<void> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                }),
            );
        } catch (error) {
            this.logger.error(`MinIO delete failed: ${error.message}`);
        }
    }
}
