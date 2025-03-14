"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const auth_entity_1 = require("../auth/auth.entity");
const medical_form_entity_1 = require("../medical-form/medical-form.entity");
const blood_test_entity_1 = require("../blood-test/blood-test.entity");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
const nodeEnv = configService.get('NODE_ENV');
const sslConfig = nodeEnv === 'production'
    ? { ssl: { rejectUnauthorized: false } }
    : {};
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    ...sslConfig,
    entities: [auth_entity_1.User, medical_form_entity_1.MedicalForm, blood_test_entity_1.BloodTest],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    migrationsTableName: 'migrations',
    logging: true,
    schema: 'public',
});
//# sourceMappingURL=typeorm.config.js.map