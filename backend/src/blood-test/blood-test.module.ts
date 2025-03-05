import { Module } from '@nestjs/common';
import { BloodTestService } from './blood-test.service';
import { BloodTestController } from './blood-test.controller';
import { BloodTest } from './blood-test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([BloodTest])],
    controllers: [BloodTestController],
    providers: [BloodTestService],
    exports: [BloodTestService],
})
export class BloodTestModule {} 