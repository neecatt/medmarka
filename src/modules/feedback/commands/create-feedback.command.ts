import { Exclude, Expose } from 'class-transformer';
import { FeedbackType } from '../domain/enums/feedback-type';
import { JwtPayload } from '@modules/auth/jwt/jwt-payload';

export class CreateFeedbackCommand {
    @Expose()
    reason: FeedbackType;

    @Expose()
    customReason?: string;

    @Expose()
    sourceId: string;

    @Exclude()
    userId?: string;

    @Exclude()
    currentUser: JwtPayload;
}
