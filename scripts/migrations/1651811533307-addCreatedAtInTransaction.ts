import {MigrationInterface, QueryRunner} from "typeorm";

export class addCreatedAtInTransaction1651811533307 implements MigrationInterface {
    name = 'addCreatedAtInTransaction1651811533307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "created_at"`);
    }

}
