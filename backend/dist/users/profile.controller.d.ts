import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { Request as ExpressRequest } from 'express';
interface RequestWithUser extends ExpressRequest {
    user: {
        id: number;
    };
}
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: RequestWithUser): Promise<{
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
    updateProfile(req: RequestWithUser, profileData: ProfileDto): Promise<{
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
export {};
