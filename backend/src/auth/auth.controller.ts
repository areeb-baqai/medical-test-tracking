import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }

    @Post('register')
    async register(@Body() authDto: AuthDto) {
        return this.authService.register(authDto);
    }
} 