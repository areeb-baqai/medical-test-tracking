import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MedicalFormService } from './medical-form.service';
import { CreateMedicalFormDto } from './medical-form.dto';
import { MedicalForm } from './medical-form.entity';



@Controller('medical-form')
export class MedicalFormController {
    constructor(private readonly medicalFormService: MedicalFormService) {}

    @Post()
    async create(@Body() createMedicalFormDto: CreateMedicalFormDto) {
        console.log("createMedicalFormDto", createMedicalFormDto);
        
        const result = await this.medicalFormService.create(createMedicalFormDto);
        return { message: 'Medical form submitted successfully!', data: result };
    }

    @Get(':id')
    async findAll(@Param('id') id: number): Promise<MedicalForm[]> {
        return this.medicalFormService.findAll(id);
    }
} 