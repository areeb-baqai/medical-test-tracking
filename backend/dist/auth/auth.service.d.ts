import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId: number): Promise<Partial<User>>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<Partial<User>>;
    validateUser(email: string, password: string): Promise<any>;
}
