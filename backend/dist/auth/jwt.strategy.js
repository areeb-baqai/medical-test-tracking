"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_entity_1 = require("./auth.entity");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(usersRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    const accessToken = request?.cookies?.accessToken;
                    console.log('Cookie extraction attempt:', { accessToken: !!accessToken });
                    return accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
            passReqToCallback: false,
        });
        this.usersRepository = usersRepository;
    }
    async validate(payload) {
        console.log('JWT payload received:', payload);
        try {
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                console.error('User not found for ID:', payload.sub);
                throw new common_1.UnauthorizedException('User not found');
            }
            console.log('User validated successfully:', user.id);
            return user;
        }
        catch (error) {
            console.error('JWT validation error:', error.message);
            throw new common_1.UnauthorizedException('Token validation failed');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map