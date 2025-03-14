"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const medical_form_module_1 = require("./medical-form/medical-form.module");
const blood_test_module_1 = require("./blood-test/blood-test.module");
const stats_module_1 = require("./stats/stats.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                synchronize: false,
                autoLoadEntities: true,
                migrationsRun: true,
                migrations: ['dist/migrations/*.js'],
                logging: true,
            }),
            auth_module_1.AuthModule,
            medical_form_module_1.MedicalFormModule,
            blood_test_module_1.BloodTestModule,
            stats_module_1.StatsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map