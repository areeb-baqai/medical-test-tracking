import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medical_forms')
export class MedicalForm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    testType: string;

    @Column()
    testValue: number;

    @Column()
    testDate: string;
} 