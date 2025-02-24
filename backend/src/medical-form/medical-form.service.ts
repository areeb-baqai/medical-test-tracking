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

    async create(createMedicalFormDto: CreateMedicalFormDto): Promise<MedicalForm> {
        const medicalForm = this.medicalFormRepository.create(createMedicalFormDto);
        return await this.medicalFormRepository.save(medicalForm);
    }
} 