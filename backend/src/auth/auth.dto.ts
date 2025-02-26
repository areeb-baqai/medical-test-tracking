import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Matches(/^[A-Za-z]+$/, { message: 'First name should only contain letters' })
    firstName: string;

    @IsString()
    @Matches(/^[A-Za-z]+$/, { message: 'Last name should only contain letters' })
    lastName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    password: string;
} 