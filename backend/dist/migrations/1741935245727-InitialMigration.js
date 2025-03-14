"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1741935245727 = void 0;
class InitialMigration1741935245727 {
    constructor() {
        this.name = 'InitialMigration1741935245727';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "medical_forms" ("id" SERIAL NOT NULL, "testType" character varying NOT NULL, "testValue" double precision NOT NULL, "testDate" character varying NOT NULL, "isAbnormal" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_13b46bcfc5c7679a61a529ef72e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "dateOfBirth" date, "gender" character varying, "height" double precision, "weight" double precision, "bloodType" character varying, "allergies" text, "medicalConditions" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blood_test" ("id" SERIAL NOT NULL, "testType" character varying NOT NULL, "testValue" double precision NOT NULL, "testDate" date NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_874657ea6cba71cb8ad6b24ffff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medical_forms" ADD CONSTRAINT "FK_3d14068d07e0f41134ccc9bf89b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_test" ADD CONSTRAINT "FK_7f2f730c07daf9c3995b67586d9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "blood_test" DROP CONSTRAINT "FK_7f2f730c07daf9c3995b67586d9"`);
        await queryRunner.query(`ALTER TABLE "medical_forms" DROP CONSTRAINT "FK_3d14068d07e0f41134ccc9bf89b"`);
        await queryRunner.query(`DROP TABLE "blood_test"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "medical_forms"`);
    }
}
exports.InitialMigration1741935245727 = InitialMigration1741935245727;
//# sourceMappingURL=1741935245727-InitialMigration.js.map