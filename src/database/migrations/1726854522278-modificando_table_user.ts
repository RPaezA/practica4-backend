import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificandoTableUser1726854522278 implements MigrationInterface {
    name = 'ModificandoTableUser1726854522278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "telefono" character varying(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telefono"`);
    }

}
