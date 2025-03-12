import { Repository } from 'typeorm';
import { MedicalForm } from '../medical-form/medical-form.entity';
import { BloodTest } from '../blood-test/blood-test.entity';
export declare class StatsService {
    private medicalFormRepository;
    private bloodTestRepository;
    constructor(medicalFormRepository: Repository<MedicalForm>, bloodTestRepository: Repository<BloodTest>);
    getTestStats(userId: number): Promise<{
        totalTests: number;
        lastTestDate: string;
    }>;
}
