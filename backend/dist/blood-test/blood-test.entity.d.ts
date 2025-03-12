import { User } from '../auth/auth.entity';
export declare class BloodTest {
    id: number;
    testType: string;
    testValue: number;
    testDate: Date;
    userId: number;
    user: User;
    createdAt: Date;
}
