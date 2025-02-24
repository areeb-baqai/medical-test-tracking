import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalFormController } from './medical-form.controller';
import { MedicalForm } from './medical-form.entity';
import { MedicalFormService } from './medical-form.service';

@Module({
    imports: [TypeOrmModule.forFeature([MedicalForm])],
    controllers: [MedicalFormController],
    providers: [MedicalFormService],
})
export class MedicalFormModule {} 