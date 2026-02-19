import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ObjectsModule } from './modules/objects/objects.module';

@Controller()
export class AppController {
    @Get()
    root() {
        return { status: 'ok', service: 'heyama-api', timestamp: new Date().toISOString() };
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/heyama'),
        ServeStaticModule.forRoot({
            rootPath: (() => {
                const path = join(__dirname, '..', 'uploads');
                console.log(`[API] Serving static files from: ${path}`);
                return path;
            })(),
            serveRoot: '/uploads',
        }),
        ObjectsModule,
    ],
    controllers: [AppController],
})
export class AppModule { }

