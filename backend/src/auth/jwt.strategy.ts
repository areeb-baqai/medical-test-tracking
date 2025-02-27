import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const accessToken = request?.cookies?.accessToken;
                    console.log('Cookie extraction attempt:', { accessToken: !!accessToken });
                    return accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
            passReqToCallback: false, // Don't need the request object in validate
        });
    }

    async validate(payload: any) {
        console.log('JWT payload received:', payload);
        
        try {
            // Find the user in the database
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            
            if (!user) {
                console.error('User not found for ID:', payload.sub);
                throw new UnauthorizedException('User not found');
            }
            
            console.log('User validated successfully:', user.id);
            return user;
        } catch (error) {
            console.error('JWT validation error:', error.message);
            throw new UnauthorizedException('Token validation failed');
        }
    }
}