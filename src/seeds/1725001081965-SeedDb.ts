import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1725001081965 implements MigrationInterface {
    name = 'SeedDb1725001081965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
        );

        //PSWD is 123
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$eXPUxgxW/rfh7q4LNFBxUOJn9SA9QFGQj9LdwgLec3UflXEyg/KA2')`,
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES
            ('dragons','dragons title','dragons description','dragons body','dragons,coffee',1 )`,
        );
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES
            ('dragons2','dragons2 title','dragons2 description','dragons2 body','dragons,coffee',1 )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
