import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Doctor } from '@modules/doctor/domain/models/doctor.entity';
import { FileInfo } from '@modules/file/domain/models/file-info.entity';
import { fileInfoRepository } from '@modules/file/repositories/file-infos.repository';
import { relayRepository } from '@modules/shared/repositories/base-relay-repository';
import { Device } from '@modules/user/domain/models/device.entity';
import { PermissionParameter } from '@modules/user/domain/models/permission-parameter.entity';
import { Permission } from '@modules/user/domain/models/permission.entity';
import { RolePermission } from '@modules/user/domain/models/role-permission.entity';
import { Role } from '@modules/user/domain/models/role.entity';
import { SettingGroup } from '@modules/user/domain/models/setting-group.entity';
import { Setting } from '@modules/user/domain/models/setting.entity';
import { UserDetails } from '@modules/user/domain/models/user-detail.entity';
import { UserPermission } from '@modules/user/domain/models/user-permission.entity';
import { UserRole } from '@modules/user/domain/models/user-role.entity';
import { UserSetting } from '@modules/user/domain/models/user-setting.entity';
import { User } from '@modules/user/domain/models/user.entity';
import { Patient } from '@modules/patient/domain/models/patient.entity';
import { Manager } from '@modules/manager/domain/models/manager.entity';
import { Question } from '@modules/question/domain/models/question.entity';
import { Tag } from '@modules/question/domain/models/tag.entity';
import { Answer } from '@modules/answer/domain/models/answer.entity';
import { Comment } from '@modules/comment/domain/models/comment.entity';
import { AnswerLike } from '@modules/answer/domain/models/answer-like.entity';
import { QuestionLike } from '@modules/question/domain/models/question-like.entity';
import { Feedback } from '@modules/feedback/domain/models/feedback.entity';
import { QuestionImage } from '@modules/question/domain/models/question-image.entity';
import { QuestionDislike } from '@modules/question/domain/models/question-dislike.entity';
import { AnswerDislike } from '@modules/answer/domain/models/answer-dislike.entity';

@Injectable()
export class DbContext {
    constructor(private readonly dataSource: DataSource) { }

    public readonly users = relayRepository(this.dataSource.getRepository(User));

    public readonly roles = relayRepository(this.dataSource.getRepository(Role));

    public readonly devices = relayRepository(this.dataSource.getRepository(Device));

    public readonly fileInfos = fileInfoRepository(relayRepository(this.dataSource.getRepository(FileInfo)));

    public readonly settingGroups = relayRepository(this.dataSource.getRepository(SettingGroup));

    public readonly settings = relayRepository(this.dataSource.getRepository(Setting));

    public readonly userDetails = relayRepository(this.dataSource.getRepository(UserDetails));

    public readonly rolePermissions = relayRepository(this.dataSource.getRepository(RolePermission));

    public readonly userPermissions = relayRepository(this.dataSource.getRepository(UserPermission));

    public readonly userRoles = relayRepository(this.dataSource.getRepository(UserRole));

    public readonly userSettings = relayRepository(this.dataSource.getRepository(UserSetting));

    public readonly permissions = relayRepository(this.dataSource.getRepository(Permission));

    public readonly permissionParameters = relayRepository(this.dataSource.getRepository(PermissionParameter));

    public readonly doctors = relayRepository(this.dataSource.getRepository(Doctor));

    public readonly patients = relayRepository(this.dataSource.getRepository(Patient));

    public readonly managers = relayRepository(this.dataSource.getRepository(Manager));

    public readonly questions = relayRepository(this.dataSource.getRepository(Question));

    public readonly tags = relayRepository(this.dataSource.getRepository(Tag));

    public readonly answers = relayRepository(this.dataSource.getRepository(Answer));

    public readonly comments = relayRepository(this.dataSource.getRepository(Comment));

    public readonly answerLikes = relayRepository(this.dataSource.getRepository(AnswerLike));

    public readonly questionLikes = relayRepository(this.dataSource.getRepository(QuestionLike));

    public readonly feedbacks = relayRepository(this.dataSource.getRepository(Feedback));

    public readonly questionImages = relayRepository(this.dataSource.getRepository(QuestionImage));

    public readonly questionDislikes = relayRepository(this.dataSource.getRepository(QuestionDislike));

    public readonly answerDislikes = relayRepository(this.dataSource.getRepository(AnswerDislike));
}
