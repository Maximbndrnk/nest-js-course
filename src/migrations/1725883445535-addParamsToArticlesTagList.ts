import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParamsToArticlesTagList1725883445535 implements MigrationInterface {
    name = 'AddParamsToArticlesTagList1725883445535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "tagList" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "tagList" DROP DEFAULT`);
    }

}
