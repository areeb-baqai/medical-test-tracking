import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/auth.entity';
import { ConfigModule } from '@nestjs/config';
import { MedicalFormModule } from './medical-form/medical-form.module';
import { MedicalForm } from './medical-form/medical-form.entity';
import { BloodTestModule } from './blood-test/blood-test.module';
import { BloodTest } from './blood-test/blood-test.entity';
import { StatsModule } from './stats/stats.module';
@Module({
    imports: [
        ConfigModule.forRoot(), // Load environment variables
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            entities: [User, MedicalForm, BloodTest],
            synchronize: process.env.NODE_ENV !== 'production',
        }),
        AuthModule,
        MedicalFormModule,
        BloodTestModule,
        StatsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {} 