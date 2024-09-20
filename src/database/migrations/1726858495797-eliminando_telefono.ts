import { MigrationInterface, QueryRunner } from "typeorm";

export class EliminandoTelefono1726858495797 implements MigrationInterface {
    name = 'EliminandoTelefono1726858495797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telefono"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "telefono" character varying(15) NOT NULL`);
    }

}
