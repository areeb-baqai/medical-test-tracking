import { Injectable } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { User } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(authDto: AuthDto) {
        console.log(authDto, " authDto");
        const hashedPassword = await bcrypt.hash(authDto.password, 10);
        const user = this.usersRepository.create({ ...authDto, password: hashedPassword });
        await this.usersRepository.save(user);
        return { message: 'User registered successfully' };
    }

    async login(authDto: AuthDto) {
        const user = await this.usersRepository.findOne({ where: { username: authDto.username } });
        if (user && await bcrypt.compare(authDto.password, user.password)) {
            const payload = { username: user.username, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
        throw new Error('Invalid credentials');
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
} 