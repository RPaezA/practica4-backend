import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifcandoRegistro21733242538834 implements MigrationInterface {
    name = 'ModifcandoRegistro21733242538834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);
    }

}
