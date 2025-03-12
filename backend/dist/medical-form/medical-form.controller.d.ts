import { MedicalFormService } from './medical-form.service';
import { CreateMedicalFormDto } from './medical-form.dto';
import { MedicalForm } from './medical-form.entity';
export declare class MedicalFormController {
    private readonly medicalFormService;
    constructor(medicalFormService: MedicalFormService);
    create(createMedicalFormDto: CreateMedicalFormDto): Promise<{
        message: string;
        data: MedicalForm;
    }>;
    findAll(id: number): Promise<MedicalForm[]>;
    uploadCSV(file: Express.Multer.File): Promise<{
        success: boolean;
        tests: string[];
        parameters: Record<string, {
            unit: string;
            min: number;
            max: number;
        }>;
    }>;
}
