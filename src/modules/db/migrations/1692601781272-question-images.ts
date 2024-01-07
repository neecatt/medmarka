import { MigrationInterface, QueryRunner } from 'typeorm';

export class questionImages1692601781272 implements MigrationInterface {
    name = 'questionImages1692601781272';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "question_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question_id" uuid NOT NULL, "file_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_069f430cc5c3e21b67c2a753539" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_images" ADD CONSTRAINT "FK_6be6f97436a9046de3185aa275b" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_images" ADD CONSTRAINT "FK_c12e6f019b89ec3ce2737e53a12" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_images" DROP CONSTRAINT "FK_c12e6f019b89ec3ce2737e53a12"`);
        await queryRunner.query(`ALTER TABLE "question_images" DROP CONSTRAINT "FK_6be6f97436a9046de3185aa275b"`);
        await queryRunner.query(`DROP TABLE "question_images"`);
    }
}
