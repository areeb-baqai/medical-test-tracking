import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './auth.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto): Promise<{ message: string }> {
        const { email, password, firstName, lastName } = registerDto;

        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        try {
            await this.usersRepository.save(user);
            return { message: 'Registration successful' };
        } catch (error) {
            throw new ConflictException('Registration failed');
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id };
        
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            
            if (!user) {
                throw new UnauthorizedException();
            }

            const newPayload = { email: user.email, sub: user.id };
            const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getProfile(userId: number): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({ 
            where: { id: userId } 
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Return everything except password
        const { password, ...result } = user;
        return result;
    }

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({ 
            where: { id: userId } 
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if email is being changed and if it's already taken
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({ 
                where: { email: updateProfileDto.email } 
            });
            if (existingUser) {
                throw new ConflictException('Email already in use');
            }
        }

        // Update user with new profile data
        Object.assign(user, {
            ...updateProfileDto,
            dateOfBirth: updateProfileDto.dateOfBirth ? new Date(updateProfileDto.dateOfBirth) : user.dateOfBirth
        });

        const savedUser = await this.usersRepository.save(user);
        const { password, ...result } = savedUser;
        return result;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
}