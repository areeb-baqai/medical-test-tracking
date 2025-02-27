import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private jwtService: JwtService, 
        private configService: ConfigService
    ) {
        super();
    }

    // This method delegates to the passport-jwt strategy
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Call the parent's canActivate method to engage the PassportJS flow
        const result = (await super.canActivate(context)) as boolean;
        return result;
    }

    // This method processes the result of the JwtStrategy's validate method
    handleRequest(err: any, user: any, info: any): any {
        
        
        // If there's an error or no user was found, throw an error
        if (err || !user) {
            throw err || new UnauthorizedException('User not authenticated');
        }

        // Return the user to be attached to the request
        return user;
    }

    validate(payload: any) {
        console.log('payload in guard ', payload);
        return payload;
    }
} 