import { Repository } from 'typeorm';
import { MedicalForm } from './medical-form.entity';
export declare class MedicalFormService {
    private medicalFormRepository;
    constructor(medicalFormRepository: Repository<MedicalForm>);
    create(data: {
        testType: string;
        testValue: number;
        testDate: string;
        userId: number;
        isAbnormal: boolean;
    }): Promise<MedicalForm>;
    findAll(id: number): Promise<MedicalForm[]>;
}
