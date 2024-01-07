import { MigrationInterface, QueryRunner } from 'typeorm';

export class likeDislike21694518962348 implements MigrationInterface {
    name = 'likeDislike21694518962348';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "answer_dislikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_da669fb6d59b2ea0eef5974f561" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "answers" ADD "dislike_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(
            `ALTER TABLE "answer_dislikes" ADD CONSTRAINT "FK_19a4b44c37d9513453779990aa5" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answer_dislikes" ADD CONSTRAINT "FK_7d36eb097a74fc1a40168aac079" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_dislikes" DROP CONSTRAINT "FK_7d36eb097a74fc1a40168aac079"`);
        await queryRunner.query(`ALTER TABLE "answer_dislikes" DROP CONSTRAINT "FK_19a4b44c37d9513453779990aa5"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "dislike_count"`);
        await queryRunner.query(`DROP TABLE "answer_dislikes"`);
    }
}
