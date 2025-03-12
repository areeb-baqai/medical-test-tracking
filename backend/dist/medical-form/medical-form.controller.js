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
exports.MedicalFormController = void 0;
const common_1 = require("@nestjs/common");
const medical_form_service_1 = require("./medical-form.service");
const medical_form_dto_1 = require("./medical-form.dto");
const platform_express_1 = require("@nestjs/platform-express");
let MedicalFormController = class MedicalFormController {
    constructor(medicalFormService) {
        this.medicalFormService = medicalFormService;
    }
    async create(createMedicalFormDto) {
        console.log("createMedicalFormDto", createMedicalFormDto);
        const result = await this.medicalFormService.create(createMedicalFormDto);
        return { message: 'Medical form submitted successfully!', data: result };
    }
    async findAll(id) {
        return this.medicalFormService.findAll(id);
    }
    async uploadCSV(file) {
        try {
            if (!file) {
                throw new Error('No file uploaded');
            }
            const fileContent = file.buffer.toString();
            const lines = fileContent.split('\n');
            const tests = lines.slice(1)
                .map(line => {
                const [name, unit, min, max] = line.split(',').map(item => item.trim());
                if (!name)
                    return null;
                return {
                    name,
                    unit: unit || 'units',
                    min: parseFloat(min) || 0,
                    max: parseFloat(max) || 100
                };
            })
                .filter(test => test !== null);
            const testNames = tests.map(test => test.name);
            const testParameters = tests.reduce((acc, test) => {
                acc[test.name] = {
                    unit: test.unit,
                    min: test.min,
                    max: test.max
                };
                return acc;
            }, {});
            return {
                success: true,
                tests: testNames,
                parameters: testParameters
            };
        }
        catch (error) {
            console.error('CSV upload error:', error);
            throw new Error('Failed to process CSV file');
        }
    }
};
exports.MedicalFormController = MedicalFormController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medical_form_dto_1.CreateMedicalFormDto]),
    __metadata("design:returntype", Promise)
], MedicalFormController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalFormController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('upload-csv'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalFormController.prototype, "uploadCSV", null);
exports.MedicalFormController = MedicalFormController = __decorate([
    (0, common_1.Controller)('medical-form'),
    __metadata("design:paramtypes", [medical_form_service_1.MedicalFormService])
], MedicalFormController);
//# sourceMappingURL=medical-form.controller.js.map