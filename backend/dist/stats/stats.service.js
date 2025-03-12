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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const medical_form_entity_1 = require("../medical-form/medical-form.entity");
const blood_test_entity_1 = require("../blood-test/blood-test.entity");
let StatsService = class StatsService {
    constructor(medicalFormRepository, bloodTestRepository) {
        this.medicalFormRepository = medicalFormRepository;
        this.bloodTestRepository = bloodTestRepository;
    }
    async getTestStats(userId) {
        const totalMedicalForms = await this.medicalFormRepository.count({
            where: { user: { id: userId } }
        });
        const totalBloodTests = await this.bloodTestRepository.count({
            where: { user: { id: userId } }
        });
        const lastMedicalForm = await this.medicalFormRepository.findOne({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
        const lastBloodTest = await this.bloodTestRepository.findOne({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
        let lastTestDate = 'Not available';
        if (lastMedicalForm || lastBloodTest) {
            const medicalFormDate = lastMedicalForm?.createdAt;
            const bloodTestDate = lastBloodTest?.createdAt;
            if (medicalFormDate && bloodTestDate) {
                lastTestDate = medicalFormDate > bloodTestDate
                    ? medicalFormDate.toISOString().split('T')[0]
                    : bloodTestDate.toISOString().split('T')[0];
            }
            else if (medicalFormDate) {
                lastTestDate = medicalFormDate.toISOString().split('T')[0];
            }
            else if (bloodTestDate) {
                lastTestDate = bloodTestDate.toISOString().split('T')[0];
            }
        }
        return {
            totalTests: totalMedicalForms + totalBloodTests,
            lastTestDate
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(medical_form_entity_1.MedicalForm)),
    __param(1, (0, typeorm_1.InjectRepository)(blood_test_entity_1.BloodTest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map