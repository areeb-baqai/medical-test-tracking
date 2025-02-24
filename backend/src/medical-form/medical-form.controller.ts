import { Controller, Post, Body, Get } from '@nestjs/common';
import { MedicalFormService } from './medical-form.service';
import { CreateMedicalFormDto } from './medical-form.dto';
import { MedicalForm } from './medical-form.entity';

@Controller('api/medical-form')
export class MedicalFormController {
    constructor(private readonly medicalFormService: MedicalFormService) {}

    @Post()
    async create(@Body() createMedicalFormDto: CreateMedicalFormDto) {
        const result = await this.medicalFormService.create(createMedicalFormDto);
        return { message: 'Medical form submitted successfully!', data: result };
    }

    @Get()
    async findAll(): Promise<MedicalForm[]> {
        return this.medicalFormService.findAll();
    }
} 