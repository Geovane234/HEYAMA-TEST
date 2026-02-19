import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
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
        ObjectsModule,
    ],
    controllers: [AppController],
})
export class AppModule { }

