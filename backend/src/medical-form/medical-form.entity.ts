import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/auth.entity';

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

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
} 