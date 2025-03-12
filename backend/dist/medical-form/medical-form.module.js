"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalFormModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const medical_form_controller_1 = require("./medical-form.controller");
const medical_form_entity_1 = require("./medical-form.entity");
const medical_form_service_1 = require("./medical-form.service");
let MedicalFormModule = class MedicalFormModule {
};
exports.MedicalFormModule = MedicalFormModule;
exports.MedicalFormModule = MedicalFormModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([medical_form_entity_1.MedicalForm])],
        controllers: [medical_form_controller_1.MedicalFormController],
        providers: [medical_form_service_1.MedicalFormService],
    })
], MedicalFormModule);
//# sourceMappingURL=medical-form.module.js.map