import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764908863798 implements MigrationInterface {
    name = 'InitialSchema1764908863798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "text" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "text"`);
    }

}
