import { MedicalForm } from '../medical-form/medical-form.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    height: number;
    weight: number;
    bloodType: string;
    allergies: string;
    medicalConditions: string;
    medicalForms: MedicalForm[];
    createdAt: Date;
    updatedAt: Date;
}
