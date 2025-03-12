import { PrismaService } from '../prisma/prisma.service';
import { ProfileDto } from './dto/profile.dto';
export declare class ProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly userSelect;
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bloodType: string | null;
        allergies: string | null;
        medicalConditions: string | null;
    }>;
    updateProfile(userId: number, profileData: ProfileDto): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bloodType: string | null;
        allergies: string | null;
        medicalConditions: string | null;
    }>;
}
