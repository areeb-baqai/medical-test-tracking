import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { User } from './auth.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
interface RequestWithUser extends Request {
    user: {
        id: number;
    };
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto, response: Response): Promise<{
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    refresh(request: any, response: Response): Promise<{
        message: string;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
    getProfile(req: RequestWithUser): Promise<Partial<User>>;
    updateProfile(req: RequestWithUser, updateProfileDto: UpdateProfileDto): Promise<Partial<User>>;
}
export {};
