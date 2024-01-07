import { Controller, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateBlurhashesCommand } from '../commands/generate-blurhashes.command';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationService } from '@modules/notification/services/notification.service';
import { TELEGRAM_EXAMPLE_APP_DEV_CHAT_ID } from '@config/environment';

@Controller('api/files')
export class FileController {
    constructor(private readonly commandBus: CommandBus, private readonly notificationService: NotificationService) {}

    @Get('regenerate-hashes')
    async regenerateBlurhashes(): Promise<any> {
        const command = new GenerateBlurhashesCommand();
        return await this.commandBus.execute(command);
    }

    @Get('send-telegram')
    async sendTelegram(): Promise<any> {
        const otp = '1234';

        const emojiOtp = otp
            .split('')
            .map((x) => String.fromCodePoint(parseInt(`003${x}`, 16)) + '\uFE0F\u20E3')
            .join('');

        await this.notificationService.send({
            templateName: 'raw',
            channelConfigs: [
                {
                    channel: ChannelType.TELEGRAM,
                    to: { chatId: TELEGRAM_EXAMPLE_APP_DEV_CHAT_ID },
                    context: { RAW: 'OTP for *\\+994999999999*\n\n' + emojiOtp },
                },
            ],
        });
    }
}
