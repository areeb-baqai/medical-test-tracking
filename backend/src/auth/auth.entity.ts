import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MedicalForm } from '../medical-form/medical-form.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ type: 'float', nullable: true })
    height: number;

    @Column({ type: 'float', nullable: true })
    weight: number;

    @Column({ nullable: true })
    bloodType: string;

    @Column({ type: 'text', nullable: true })
    allergies: string;

    @Column({ type: 'text', nullable: true })
    medicalConditions: string;

    @OneToMany(() => MedicalForm, medicalForm => medicalForm.user)
    medicalForms: MedicalForm[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 