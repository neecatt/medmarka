export class ActivateAccountOtpCommand {
    constructor(readonly token: string, readonly otp: string) {}
}
