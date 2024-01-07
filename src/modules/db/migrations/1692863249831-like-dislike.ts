import { MigrationInterface, QueryRunner } from 'typeorm';

export class likeDislike1692863249831 implements MigrationInterface {
    name = 'likeDislike1692863249831';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "question_dislikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6e582ca75523032c65deebabcc9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "questions" ADD "dislike_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(
            `ALTER TABLE "question_dislikes" ADD CONSTRAINT "FK_c1e3eec0fd9f69ac0df61009849" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_dislikes" ADD CONSTRAINT "FK_00c07d81c6762da1f0b5eeb3f23" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_dislikes" DROP CONSTRAINT "FK_00c07d81c6762da1f0b5eeb3f23"`);
        await queryRunner.query(`ALTER TABLE "question_dislikes" DROP CONSTRAINT "FK_c1e3eec0fd9f69ac0df61009849"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "dislike_count"`);
        await queryRunner.query(`DROP TABLE "question_dislikes"`);
    }
}
