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
exports.BloodTestController = void 0;
const blood_test_service_1 = require("./blood-test.service");
const common_1 = require("@nestjs/common");
let BloodTestController = class BloodTestController {
    constructor(bloodTestService) {
        this.bloodTestService = bloodTestService;
    }
    async getUserBloodTests(id) {
        return this.bloodTestService.getBloodTestsForUser(parseInt(id));
    }
};
exports.BloodTestController = BloodTestController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BloodTestController.prototype, "getUserBloodTests", null);
exports.BloodTestController = BloodTestController = __decorate([
    (0, common_1.Controller)('blood-tests'),
    __metadata("design:paramtypes", [blood_test_service_1.BloodTestService])
], BloodTestController);
//# sourceMappingURL=blood-test.controller.js.map