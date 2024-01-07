import { Global, Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { TemplateService } from './services/template.service';
import { TelegramModule } from './plugins/telegram/telegram.module';
import { EmailModule } from '@modules/notification/plugins/email/email.module';
import { PushModule } from '@modules/notification/plugins/push/push.module';
import { WebPushModule } from '@modules/notification/plugins/web-push/web-push.module';

const services = [NotificationService, TemplateService];

const providers = [...services];

@Global()
@Module({
    imports: [EmailModule, PushModule, WebPushModule, TelegramModule],
    providers,
    exports: [...services],
})
export class NotificationModule {}
