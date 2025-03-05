import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalForm } from '../medical-form/medical-form.entity';
import { BloodTest } from '../blood-test/blood-test.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(MedicalForm)
        private medicalFormRepository: Repository<MedicalForm>,
        @InjectRepository(BloodTest)
        private bloodTestRepository: Repository<BloodTest>
    ) {}

    async getTestStats(userId: number) {
        // Get total number of tests
        const totalMedicalForms = await this.medicalFormRepository.count({
            where: { user: { id: userId } }
        });

        const totalBloodTests = await this.bloodTestRepository.count({
            where: { user: { id: userId } }
        });

        // Get the date of the last test
        const lastMedicalForm = await this.medicalFormRepository.findOne({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });

        const lastBloodTest = await this.bloodTestRepository.findOne({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });

        // Determine the most recent test date between medical forms and blood tests
        let lastTestDate = 'Not available';
        if (lastMedicalForm || lastBloodTest) {
            const medicalFormDate = lastMedicalForm?.createdAt;
            const bloodTestDate = lastBloodTest?.createdAt;

            if (medicalFormDate && bloodTestDate) {
                lastTestDate = medicalFormDate > bloodTestDate 
                    ? medicalFormDate.toISOString().split('T')[0]
                    : bloodTestDate.toISOString().split('T')[0];
            } else if (medicalFormDate) {
                lastTestDate = medicalFormDate.toISOString().split('T')[0];
            } else if (bloodTestDate) {
                lastTestDate = bloodTestDate.toISOString().split('T')[0];
            }
        }

        return {
            totalTests: totalMedicalForms + totalBloodTests,
            lastTestDate
        };
    }
} 