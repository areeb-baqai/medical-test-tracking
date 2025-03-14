import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MedicalFormModule } from './medical-form/medical-form.module';
import { BloodTestModule } from './blood-test/blood-test.module';
import { StatsModule } from './stats/stats.module';

@Module({
    imports: [
        ConfigModule.forRoot(), // Load environment variables
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            synchronize: false,
            autoLoadEntities: true,
            migrationsRun: true,
            migrations: ['dist/migrations/*.js'],
            logging: true,
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