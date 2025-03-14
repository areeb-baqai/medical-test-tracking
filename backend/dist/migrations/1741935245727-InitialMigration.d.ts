import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitialMigration1741935245727 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
