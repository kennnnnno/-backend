import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1765506879102 implements MigrationInterface {
    name = 'InitialSchema1765506879102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "Photoid" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "Photoid"`);
    }

}
