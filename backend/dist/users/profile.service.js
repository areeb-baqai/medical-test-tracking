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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfileService = class ProfileService {
    constructor(prisma) {
        this.prisma = prisma;
        this.userSelect = {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
            height: true,
            weight: true,
            bloodType: true,
            allergies: true,
            medicalConditions: true,
        };
    }
    async getProfile(userId) {
        const profile = await this.prisma.user.findUnique({
            where: { id: userId },
            select: this.userSelect,
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async updateProfile(userId, profileData) {
        try {
            const updatedProfile = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...profileData,
                    dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
                },
                select: this.userSelect,
            });
            return updatedProfile;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Email already exists');
            }
            throw error;
        }
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map