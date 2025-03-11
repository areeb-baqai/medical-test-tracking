import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalForm } from './medical-form.entity';
import { CreateMedicalFormDto } from './medical-form.dto';

@Injectable()
export class MedicalFormService {
    constructor(
        @InjectRepository(MedicalForm)
        private medicalFormRepository: Repository<MedicalForm>,
    ) {}

    async create(data: {
        testType: string;
        testValue: number;
        testDate: string;
        userId: number;
        isAbnormal: boolean;
    }): Promise<MedicalForm> {
        const medicalForm = this.medicalFormRepository.create(data);
        return this.medicalFormRepository.save(medicalForm);
    }

    async findAll(id: number): Promise<MedicalForm[]> {
        return this.medicalFormRepository.find({
            where: {
                userId: id
            }
        });
    }
} 