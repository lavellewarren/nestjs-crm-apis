import {MigrationInterface, QueryRunner} from "typeorm";

export class createTransactionTable1651549494021 implements MigrationInterface {
    name = 'createTransactionTable1651549494021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("transaction_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorize_transaction_id" character varying, "invoice_number" character varying NOT NULL, "product_name" character varying NOT NULL, "coupon" character varying, "original_amount" double precision NOT NULL, "paid_amount" double precision, "status" character varying, CONSTRAINT "PK_9162bf9ab4e31961a8f7932974c" PRIMARY KEY ("transaction_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
