import { Expose } from 'class-transformer';
import { FeedbackDecision } from '../domain/enums/feedback-decision';

export class MakeDecisionCommand {
    @Expose()
    id: string;

    @Expose()
    decision: FeedbackDecision;
}
