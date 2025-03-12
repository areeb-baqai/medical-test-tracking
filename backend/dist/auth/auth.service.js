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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const auth_entity_1 = require("./auth.entity");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        try {
            await this.usersRepository.save(user);
            return { message: 'Registration successful' };
        }
        catch (error) {
            throw new common_1.ConflictException('Registration failed');
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            const newPayload = { email: user.email, sub: user.id };
            const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, ...result } = user;
        return result;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateProfileDto.email }
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        Object.assign(user, {
            ...updateProfileDto,
            dateOfBirth: updateProfileDto.dateOfBirth ? new Date(updateProfileDto.dateOfBirth) : user.dateOfBirth
        });
        const savedUser = await this.usersRepository.save(user);
        const { password, ...result } = savedUser;
        return result;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map