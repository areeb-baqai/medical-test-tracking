"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodTestModule = void 0;
const common_1 = require("@nestjs/common");
const blood_test_service_1 = require("./blood-test.service");
const blood_test_controller_1 = require("./blood-test.controller");
const blood_test_entity_1 = require("./blood-test.entity");
const typeorm_1 = require("@nestjs/typeorm");
let BloodTestModule = class BloodTestModule {
};
exports.BloodTestModule = BloodTestModule;
exports.BloodTestModule = BloodTestModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([blood_test_entity_1.BloodTest])],
        controllers: [blood_test_controller_1.BloodTestController],
        providers: [blood_test_service_1.BloodTestService],
        exports: [blood_test_service_1.BloodTestService],
    })
], BloodTestModule);
//# sourceMappingURL=blood-test.module.js.map