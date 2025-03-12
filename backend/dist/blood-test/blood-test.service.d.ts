import { Repository } from 'typeorm';
import { BloodTest } from './blood-test.entity';
export declare class BloodTestService {
    private bloodTestRepository;
    constructor(bloodTestRepository: Repository<BloodTest>);
    getBloodTestsForUser(userId: number): Promise<BloodTest[]>;
}
