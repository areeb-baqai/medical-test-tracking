import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MedicalFormService } from './medical-form.service';
import { CreateMedicalFormDto } from './medical-form.dto';
import { MedicalForm } from './medical-form.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'csv-parse/sync';
import { Express } from 'express-serve-static-core';

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

    @Post('upload-csv')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCSV(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new Error('No file uploaded');
            }

            const fileContent = file.buffer.toString();
            const lines = fileContent.split('\n');
            
            // Skip header row and process data
            const tests = lines.slice(1)
                .map(line => {
                    const [name, unit, min, max] = line.split(',').map(item => item.trim());
                    if (!name) return null;

                    return {
                        name,
                        unit: unit || 'units',
                        min: parseFloat(min) || 0,
                        max: parseFloat(max) || 100
                    };
                })
                .filter(test => test !== null); // Remove any invalid entries

            // Extract just the test names for the frontend
            const testNames = tests.map(test => test.name);

            // Store the complete test data in CBC_PARAMETERS format
            const testParameters = tests.reduce((acc: Record<string, { unit: string, min: number, max: number }>, test) => {
                acc[test.name] = {
                    unit: test.unit,
                    min: test.min,
                    max: test.max
                };
                return acc;
            }, {});

            return {
                success: true,
                tests: testNames,
                parameters: testParameters
            };
        } catch (error) {
            console.error('CSV upload error:', error);
            throw new Error('Failed to process CSV file');
        }
    }
} 