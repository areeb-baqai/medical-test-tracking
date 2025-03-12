import { Controller, Post, Body, Get, Req, Res, UseGuards, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth.guard';
import { GetUser } from './user.decorator';
import { User } from './auth.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface RequestWithUser extends Request {
    user: { id: number }
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { user, tokens } = await this.authService.login(loginDto);

        // Set cookies
        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { user };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() request: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = request.cookies.refreshToken;
        const tokens = await this.authService.refreshTokens(refreshToken);

        // Set new cookies
        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { message: 'Tokens refreshed successfully' };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('accessToken');
        response.clearCookie('refreshToken');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: RequestWithUser) {
        return this.authService.getProfile(req.user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @Req() req: RequestWithUser,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        return this.authService.updateProfile(req.user.id, updateProfileDto);
    }
} 