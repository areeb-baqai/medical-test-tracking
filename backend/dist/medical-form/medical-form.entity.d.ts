import { User } from '../auth/auth.entity';
export declare class MedicalForm {
    id: number;
    testType: string;
    testValue: number;
    testDate: string;
    isAbnormal: boolean;
    userId: number;
    user: User;
    createdAt: Date;
}
