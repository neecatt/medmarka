import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialMigration1689163578516 implements MigrationInterface {
    name = 'initialMigration1689163578516';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema('permission');
        await queryRunner.createSchema('payment');
        await queryRunner.createSchema('blog');

        await queryRunner.query(
            `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "usage_count" integer NOT NULL DEFAULT '0', "is_auto_created" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."devices_platform_enum" AS ENUM('IOS', 'ANDROID', 'WEB')`);
        await queryRunner.query(
            `CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "push_token" jsonb NOT NULL, "platform" "public"."devices_platform_enum", "user_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_68edab745de60a7b36c6223e43" ON "devices" ("push_token") `);
        await queryRunner.query(
            `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectName" character varying, "name" character varying NOT NULL, "url" character varying NOT NULL, "blurhash" jsonb, "size" integer NOT NULL, "extension" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_332d10755187ac3c580e21fbc0" ON "files" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2a26d04373d1dcc04c7f7aee21" ON "files" ("url") `);
        await queryRunner.query(`CREATE INDEX "IDX_2131397e72958a5d3d76b356c4" ON "files" ("extension") `);
        await queryRunner.query(`CREATE TYPE "public"."user_details_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(
            `CREATE TABLE "user_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying, "date_of_birth" TIMESTAMP, "last_login" TIMESTAMP, "gender" "public"."user_details_gender_enum", "bio" text, "address" character varying, "avatar_id" uuid, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_ef1a1915f99bcf7a87049f7449" UNIQUE ("user_id"), CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "permission"."permissions_name_enum" AS ENUM('DASHBOARD_WIEW', 'CUSTOMERS_WIEW', 'CUSTOMERS_CREATE', 'CUSTOMERS_UPDATE', 'CUSTOMERS_DELETE', 'DOCTORS_WIEW', 'DOCTORS_CREATE', 'DOCTORS_UPDATE', 'DOCTORS_DELETE', 'REPORTS_VIEW', 'REPORTS_CREATE', 'REPORTS_UPDATE', 'REPORTS_DELETE', 'EMAIL_NOTIFICATIONS_VIEW', 'EMAIL_NOTIFICATIONS_CREATE', 'EMAIL_NOTIFICATIONS_UPDATE', 'EMAIL_NOTIFICATIONS_DELETE', 'SMS_NOTIFICATIONS_VIEW', 'SMS_NOTIFICATIONS_CREATE', 'SMS_NOTIFICATIONS_UPDATE', 'SMS_NOTIFICATIONS_DELETE', 'SERVICES_VIEW', 'SERVICES_CREATE', 'SERVICES_UPDATE', 'SERVICES_DELETE', 'COMMON_SETTINGS_VIEW', 'COMMON_SETTINGS_CREATE', 'COMMON_SETTINGS_UPDATE', 'COMMON_SETTINGS_DELETE', 'FAQS_VIEW', 'FAQS_CREATE', 'FAQS_UPDATE', 'FAQS_DELETE', 'TERMS_AND_CONDITIONS_VIEW', 'TERMS_AND_CONDITIONS_UPDATE', 'HOME_PAGE_VIEW', 'HOME_PAGE_UPDATE', 'ABOUT_US_VIEW', 'ABOUT_US_UPDATE', 'USERS_VIEW', 'USERS_CREATE', 'USERS_UPDATE', 'USERS_DELETE')`,
        );
        await queryRunner.query(
            `CREATE TABLE "permission"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "permission"."permissions_name_enum" NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_48ce552495d14eae9b187bb671" ON "permission"."permissions" ("name") `,
        );
        await queryRunner.query(
            `CREATE TYPE "permission"."permission_parameters_value_enum" AS ENUM('ALL', 'COUNTRY', 'USER')`,
        );
        await queryRunner.query(`CREATE TYPE "permission"."permission_parameters_type_enum" AS ENUM('STRING')`);
        await queryRunner.query(
            `CREATE TABLE "permission"."permission_parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" "permission"."permission_parameters_value_enum" NOT NULL, "type" "permission"."permission_parameters_type_enum" NOT NULL, "description" character varying NOT NULL, "permission_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b68ddcab0397ee2ba2436f55c87" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "permission"."user_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "permission_id" uuid NOT NULL, "parameter_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_a537c48b1f80e8626a71cb5658" ON "permission"."user_permissions" ("user_id", "permission_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "permission"."role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, "parameter_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_25d24010f53bb80b78e412c965" ON "permission"."role_permissions" ("role_id", "permission_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
        await queryRunner.query(
            `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "setting_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_d743b68d4f14b4f9088d17c3f95" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_133407c5567259ec9073abb445" ON "setting_groups" ("name") `);
        await queryRunner.query(
            `CREATE TYPE "public"."settings_type_enum" AS ENUM('THEME', 'LANGUAGE', 'RECEIVE_EMAIL_NOTIFICATIONS', 'RECEIVE_SMS_NOTIFICATIONS')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."settings_data_type_enum" AS ENUM('STRING', 'BOOLEAN', 'INTEGER')`,
        );
        await queryRunner.query(
            `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."settings_type_enum" NOT NULL, "scopes" jsonb NOT NULL, "required" boolean NOT NULL, "data_type" "public"."settings_data_type_enum" NOT NULL, "allowed_values" jsonb, "group_id" uuid, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b99ecb7dd618e87685bdde6940" ON "settings" ("type") `);
        await queryRunner.query(
            `CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "setting_id" uuid NOT NULL, "value" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."doctors_profession_enum" AS ENUM('CARDIOLOGIST', 'UROLOGIST')`);
        await queryRunner.query(`CREATE TYPE "public"."doctors_degree_enum" AS ENUM('UZMAN')`);
        await queryRunner.query(
            `CREATE TABLE "doctors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "profession" "public"."doctors_profession_enum" NOT NULL, "degree" "public"."doctors_degree_enum" NOT NULL, "title" character varying NOT NULL, "organization" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_653c27d1b10652eb0c7bbbc442" UNIQUE ("user_id"), CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "managers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_f041d245569d3b05305ec8dbea" UNIQUE ("user_id"), CONSTRAINT "PK_e70b8cc457276d9b4d82342a8ff" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "is_registered" boolean NOT NULL DEFAULT false, "is_blocked" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "show_profile" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_7fe1518dc780fd777669b5cb7a" UNIQUE ("user_id"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."questions_status_enum" AS ENUM('PUBLISHED', 'REPORTED', 'REMOVED', 'BLOCKED')`,
        );
        await queryRunner.query(
            `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "patient_id" uuid NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "status" "public"."questions_status_enum" NOT NULL DEFAULT 'PUBLISHED', "like_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."answers_status_enum" AS ENUM('PUBLISHED', 'REPORTED', 'REMOVED', 'BLOCKED')`,
        );
        await queryRunner.query(
            `CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "text" text NOT NULL, "question_id" uuid NOT NULL, "index" integer NOT NULL DEFAULT '1', "status" "public"."answers_status_enum" NOT NULL DEFAULT 'PUBLISHED', "like_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."feedbacks_reason_enum" AS ENUM('POLICY_VIOLATION', 'IRRELEVANT_IMAGE', 'SPAM_SCAM', 'IRRELEVANT_DESCRIPTION', 'CATEGORY', 'OTHER')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."feedbacks_source_enum" AS ENUM('ANSWER', 'COMMENT', 'QUESTION')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."feedbacks_decision_enum" AS ENUM('PENDING', 'PASSED', 'BLOCKED', 'UNBLOCK')`,
        );
        await queryRunner.query(
            `CREATE TABLE "feedbacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" "public"."feedbacks_reason_enum" NOT NULL, "custom_reason" character varying(100), "source" "public"."feedbacks_source_enum" NOT NULL, "source_id" character varying NOT NULL, "user_id" uuid, "decision" "public"."feedbacks_decision_enum" NOT NULL DEFAULT 'PENDING', "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_79affc530fdd838a9f1e0cc30be" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "answer_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_e49a287b586adcffa71bb296d85" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."comments_status_enum" AS ENUM('PUBLISHED', 'REPORTED', 'REMOVED', 'BLOCKED')`,
        );
        await queryRunner.query(
            `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "text" text NOT NULL, "question_id" uuid NOT NULL, "answer_id" uuid NOT NULL, "status" "public"."comments_status_enum" NOT NULL DEFAULT 'PUBLISHED', "like_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_59374a4cf64692298fed272ab2" ON "comments" ("answer_id", "text", "user_id") `,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_75536e279c91471da61a34f7a0" ON "comments" ("question_id", "text", "user_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "question_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a7896ec45cde127d2120aca7342" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "question_tags" ("question_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_1c7296b35b6f04f8a7c245cccdc" PRIMARY KEY ("question_id", "tag_id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_da3d79ee83f674d9f5fc9cc88d" ON "question_tags" ("question_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_497e97015cc760e52aa0b8c258" ON "question_tags" ("tag_id") `);
        await queryRunner.query(
            `ALTER TABLE "devices" ADD CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_details" ADD CONSTRAINT "FK_8d5e97c30a0ba60a324439a114d" FOREIGN KEY ("avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_details" ADD CONSTRAINT "FK_ef1a1915f99bcf7a87049f74494" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."permission_parameters" ADD CONSTRAINT "FK_b07d0b82a941e0e7ee8516708e0" FOREIGN KEY ("permission_id") REFERENCES "permission"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."user_permissions" ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."user_permissions" ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY ("permission_id") REFERENCES "permission"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."user_permissions" ADD CONSTRAINT "FK_ba71b277f21de1be4889209f190" FOREIGN KEY ("parameter_id") REFERENCES "permission"."permission_parameters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permission"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."role_permissions" ADD CONSTRAINT "FK_6d0cdad2fd314ba5e9bb8857284" FOREIGN KEY ("parameter_id") REFERENCES "permission"."permission_parameters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "settings" ADD CONSTRAINT "FK_35eb8ab2edefee1ddeaf85f4603" FOREIGN KEY ("group_id") REFERENCES "setting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_a18669db5f0af9d678fb0f7581c" FOREIGN KEY ("setting_id") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "doctors" ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "managers" ADD CONSTRAINT "FK_f041d245569d3b05305ec8dbead" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "patients" ADD CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions" ADD CONSTRAINT "FK_b38188320a06650d0ae0ba31234" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" ADD CONSTRAINT "FK_f4cf663ebeca05b7a12f6a2cc97" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answers" ADD CONSTRAINT "FK_677120094cf6d3f12df0b9dc5d3" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_4334f6be2d7d841a9d5205a100e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answer_likes" ADD CONSTRAINT "FK_3238ed66480f5d20aca6ebdf997" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "answer_likes" ADD CONSTRAINT "FK_f8990b22ddb395791585946c3f9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_8a7f0e1af904d87ccee32d4de32" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_235829ea2864b85eca93a90d92e" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_likes" ADD CONSTRAINT "FK_afedf0e8d458e2fab5535541498" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_likes" ADD CONSTRAINT "FK_3c5657652b374bc30c87ab837a1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_tags" ADD CONSTRAINT "FK_da3d79ee83f674d9f5fc9cc88d0" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_tags" ADD CONSTRAINT "FK_497e97015cc760e52aa0b8c2586" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_tags" DROP CONSTRAINT "FK_497e97015cc760e52aa0b8c2586"`);
        await queryRunner.query(`ALTER TABLE "question_tags" DROP CONSTRAINT "FK_da3d79ee83f674d9f5fc9cc88d0"`);
        await queryRunner.query(`ALTER TABLE "question_likes" DROP CONSTRAINT "FK_3c5657652b374bc30c87ab837a1"`);
        await queryRunner.query(`ALTER TABLE "question_likes" DROP CONSTRAINT "FK_afedf0e8d458e2fab5535541498"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_235829ea2864b85eca93a90d92e"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_8a7f0e1af904d87ccee32d4de32"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "answer_likes" DROP CONSTRAINT "FK_f8990b22ddb395791585946c3f9"`);
        await queryRunner.query(`ALTER TABLE "answer_likes" DROP CONSTRAINT "FK_3238ed66480f5d20aca6ebdf997"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_4334f6be2d7d841a9d5205a100e"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_677120094cf6d3f12df0b9dc5d3"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_f4cf663ebeca05b7a12f6a2cc97"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_b38188320a06650d0ae0ba31234"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0"`);
        await queryRunner.query(`ALTER TABLE "managers" DROP CONSTRAINT "FK_f041d245569d3b05305ec8dbead"`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_a18669db5f0af9d678fb0f7581c"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
        await queryRunner.query(`ALTER TABLE "settings" DROP CONSTRAINT "FK_35eb8ab2edefee1ddeaf85f4603"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(
            `ALTER TABLE "permission"."role_permissions" DROP CONSTRAINT "FK_6d0cdad2fd314ba5e9bb8857284"`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."user_permissions" DROP CONSTRAINT "FK_ba71b277f21de1be4889209f190"`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."user_permissions" DROP CONSTRAINT "FK_8145f5fadacd311693c15e41f10"`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."user_permissions" DROP CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "permission"."permission_parameters" DROP CONSTRAINT "FK_b07d0b82a941e0e7ee8516708e0"`,
        );
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_ef1a1915f99bcf7a87049f74494"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_8d5e97c30a0ba60a324439a114d"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_497e97015cc760e52aa0b8c258"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da3d79ee83f674d9f5fc9cc88d"`);
        await queryRunner.query(`DROP TABLE "question_tags"`);
        await queryRunner.query(`DROP TABLE "question_likes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75536e279c91471da61a34f7a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59374a4cf64692298fed272ab2"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TYPE "public"."comments_status_enum"`);
        await queryRunner.query(`DROP TABLE "answer_likes"`);
        await queryRunner.query(`DROP TABLE "feedbacks"`);
        await queryRunner.query(`DROP TYPE "public"."feedbacks_decision_enum"`);
        await queryRunner.query(`DROP TYPE "public"."feedbacks_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."feedbacks_reason_enum"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TYPE "public"."answers_status_enum"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TYPE "public"."questions_status_enum"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "managers"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
        await queryRunner.query(`DROP TYPE "public"."doctors_degree_enum"`);
        await queryRunner.query(`DROP TYPE "public"."doctors_profession_enum"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b99ecb7dd618e87685bdde6940"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TYPE "public"."settings_data_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."settings_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_133407c5567259ec9073abb445"`);
        await queryRunner.query(`DROP TABLE "setting_groups"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "permission"."IDX_25d24010f53bb80b78e412c965"`);
        await queryRunner.query(`DROP TABLE "permission"."role_permissions"`);
        await queryRunner.query(`DROP INDEX "permission"."IDX_a537c48b1f80e8626a71cb5658"`);
        await queryRunner.query(`DROP TABLE "permission"."user_permissions"`);
        await queryRunner.query(`DROP TABLE "permission"."permission_parameters"`);
        await queryRunner.query(`DROP TYPE "permission"."permission_parameters_type_enum"`);
        await queryRunner.query(`DROP TYPE "permission"."permission_parameters_value_enum"`);
        await queryRunner.query(`DROP INDEX "permission"."IDX_48ce552495d14eae9b187bb671"`);
        await queryRunner.query(`DROP TABLE "permission"."permissions"`);
        await queryRunner.query(`DROP TYPE "permission"."permissions_name_enum"`);
        await queryRunner.query(`DROP TABLE "user_details"`);
        await queryRunner.query(`DROP TYPE "public"."user_details_gender_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2131397e72958a5d3d76b356c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a26d04373d1dcc04c7f7aee21"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_332d10755187ac3c580e21fbc0"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68edab745de60a7b36c6223e43"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TYPE "public"."devices_platform_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }
}
