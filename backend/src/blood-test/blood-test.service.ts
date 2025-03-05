import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodTest } from './blood-test.entity';

@Injectable()
export class BloodTestService {
    constructor(
        @InjectRepository(BloodTest)
        private bloodTestRepository: Repository<BloodTest>,
    ) {}

    async getBloodTestsForUser(userId: number): Promise<BloodTest[]> {
        return this.bloodTestRepository.find({ where: { userId } });
    }
} 