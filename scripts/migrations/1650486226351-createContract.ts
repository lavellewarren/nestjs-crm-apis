import {MigrationInterface, QueryRunner} from "typeorm";

export class createContract1650486226351 implements MigrationInterface {
    name = 'createContract1650486226351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contracts" ("contract_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "company_name" character varying NOT NULL, "contract_name" character varying NOT NULL, "contract_number" character varying NOT NULL, "contract_email" character varying NOT NULL, "trade_services" character varying NOT NULL, "service_areas" character varying NOT NULL, "hourly_rate" double precision NOT NULL, "status" character varying, CONSTRAINT "PK_d4c091e72433a7125d9158170e7" PRIMARY KEY ("contract_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contracts"`);
    }

}
