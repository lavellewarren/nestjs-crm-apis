import {MigrationInterface, QueryRunner} from "typeorm";

export class createClaimTable1650662843977 implements MigrationInterface {
    name = 'createClaimTable1650662843977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "claims" ("claim_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "street_address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "description" character varying NOT NULL, "is_emergency" boolean NOT NULL, "contact_methods" character varying NOT NULL, "technicians" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_e8c55807de8dde683de34399da3" PRIMARY KEY ("claim_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "claims"`);
    }

}
