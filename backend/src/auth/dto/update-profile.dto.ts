import { IsString, IsOptional, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsNumber()
    @IsOptional()
    height?: number;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsString()
    @IsOptional()
    bloodType?: string;

    @IsString()
    @IsOptional()
    allergies?: string;

    @IsString()
    @IsOptional()
    medicalConditions?: string;
} 