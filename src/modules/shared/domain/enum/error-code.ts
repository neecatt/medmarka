import { registerEnumType } from '@nestjs/graphql';

export enum ErrorCode {
    ACTION_NOT_ALLOWED = 'ACTION_NOT_ALLOWED',
    INVALID_SOURCE = 'INVALID_SOURCE',

    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_WITHOUT_ROLE = 'USER_WITHOUT_ROLE',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',

    DOCTOR_NOT_FOUND = 'DOCTOR_NOT_FOUND',
    DOCTOR_NOT_ALLOWED_TO_CREATE_QUESTION = 'DOCTOR_NOT_ALLOWED_TO_CREATE_QUESTION',

    PATIENT_NOT_FOUND = 'PATIENT_NOT_FOUND',

    MANAGER_NOT_FOUND = 'MANAGER_NOT_FOUND',

    EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED',
    PASSWORD_INVALID = 'PASSWORD_INVALID',
    ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
    USER_SETTING_NOT_FOUND = 'USER_SETTING_NOT_FOUND',
    EMAIL_OR_PASSWORD_INVALID = 'EMAIL_OR_PASSWORD_INVALID',
    EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
    ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    INVALID_FILE_EXTENSION = 'INVALID_FILE_EXTENSION',
    VERIFICATION_CODE_IS_WRONG = 'VERIFICATION_CODE_IS_WRONG',

    TAG_NOT_FOUND = 'TAG_NOT_FOUND',

    QUESTION_NOT_FOUND = 'QUESTION_NOT_FOUND',
    QUESTION_ALREADY_BLOCKED = 'QUESTION_ALREADY_BLOCKED',
    QUESTION_ALREADY_PUBLISHED = 'QUESTION_ALREADY_PUBLISHED',
    QUESTION_ALREADY_LIKE_DELETED = "QUESTION_ALREADY_LIKE_DELETED",
    QUESTION_ALREADY_LIKED = 'QUESTION_ALREADY_LIKED',
    QUESTION_ALREADY_DISLIKED = 'QUESTION_ALREADY_DISLIKED',

    ANSWER_NOT_FOUND = 'ANSWER_NOT_FOUND',
    ANSWER_ALREADY_LIKED = 'ANSWER_ALREADY_LIKED',
    ANSWER_ALREADY_DISLIKED = 'ANSWER_ALREADY_DISLIKED',
    ANSWER_ALREADY_BLOCKED = 'ANSWER_ALREADY_BLOCKED',
    ANSWER_ALREADY_PUBLISHED = 'ANSWER_ALREADY_PUBLISHED',
    ANSWER_LIKE_ALREADY_DELETED = 'ANSWER_LIKE_ALREADY_DELETED',
    ANSWER_DISLIKE_ALREADY_DELETED = 'ANSWER_DISLIKE_ALREADY_DELETED',

    COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
    COMMENT_ALREADY_EXIST = 'COMMENT_ALREADY_EXIST',
    COMMENT_ALREADY_BLOCKED = 'COMMENT_ALREADY_BLOCKED',
    COMMENT_ALREADY_PUBLISHED = 'COMMENT_ALREADY_PUBLISHED',

    FEEDBACK_ALREADY_EXIST = 'FEEDBACK_ALREADY_EXIST',
    FEEDBACK_NOT_FOUND = 'FEEDBACK_NOT_FOUND',
}

registerEnumType(ErrorCode, { name: 'ErrorCode' });