import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/auth.entity';
import { ConfigModule } from '@nestjs/config';
import { MedicalFormModule } from './medical-form/medical-form.module';
import { MedicalForm } from './medical-form/medical-form.entity';

@Module({
    imports: [
        ConfigModule.forRoot(), // Load environment variables
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost', // Default to 'localhost'
            port: +process.env.DB_PORT! || 5432, // Use '!' to assert that it is defined
            username: process.env.DB_USERNAME || 'Areeb', // Default username
            password: process.env.DB_PASSWORD || '1234', // Default password
            database: process.env.DB_NAME || 'testdb', // Default database
            entities: [User, MedicalForm],
            synchronize: true, // Set to false in production
        }),
        AuthModule,
        MedicalFormModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {} 