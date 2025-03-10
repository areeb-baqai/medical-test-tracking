import { IsNotEmpty, IsNumber, IsString, IsDateString, IsBoolean } from 'class-validator';

export class CreateMedicalFormDto {
    @IsNotEmpty()
    @IsString()
    testType: string;

    @IsNotEmpty()
    @IsNumber()
    testValue: number;

    @IsNotEmpty()
    @IsDateString()
    testDate: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsBoolean()
    isAbnormal: boolean;
} 