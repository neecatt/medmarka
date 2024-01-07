import { Attachment } from 'nodemailer/lib/mailer';

export type EmailTemplateContext = {
    TITLE?: string;
    SUBJECT?: string;
    ATTACHMENTS?: Attachment[];
    RAW?: string;
};

export type PushTemplateContext = {
    TITLE?: string;
    SUBTITLE?: string;
    DATA?: any;
};

export type WebPushTemplateContext = {
    TITLE?: string;
    DATA?: any;
};

export type TelegramTemplateContext = {
    RAW?: string;
};

export type TemplateContext = (
    | EmailTemplateContext
    | PushTemplateContext
    | WebPushTemplateContext
    | TelegramTemplateContext
) & {
    RAW?: string;
    [name: string]: any;
};
