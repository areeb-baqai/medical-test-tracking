import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../auth/auth.entity';

@Entity('medical_forms')
export class MedicalForm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    testType: string;

    @Column('float')
    testValue: number;

    @Column()
    testDate: string;

    @Column({ default: false })
    isAbnormal: boolean;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
} 