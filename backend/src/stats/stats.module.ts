import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { MedicalForm } from '../medical-form/medical-form.entity';
import { BloodTest } from '../blood-test/blood-test.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([MedicalForm, BloodTest]),
        AuthModule,
        ConfigModule,
    ],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule {} 