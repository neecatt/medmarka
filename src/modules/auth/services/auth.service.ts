import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { CommandBus } from '@nestjs/cqrs';
import { JwtPayload, JwtPermission } from '../jwt/jwt-payload';
import { ActivateAccountCommand } from '../commands/activate-account.command';
import { DbContext } from '@modules/db/db-context';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { RoleName } from '@modules/user/domain/enums/role-name';
import { User } from '@modules/user/domain/models/user.entity';

@Injectable()
export class AuthService {
    @Inject() protected readonly dbContext: DbContext;
    @Inject() protected readonly jwt: JwtService;
    @Inject() private readonly commandBus: CommandBus;

    async validateJwtPayloadAsync(payload: JwtPayload): Promise<JwtPayload> {
        const user = await this.dbContext.users.findOne({ where: { id: payload.id } });

        if (!user || !user.emailVerified) {
            throw new UnauthorizedException();
        }

        return payload;
    }

    async generateJwtTokenAsync(payload: JwtPayload): Promise<string> {
        return await this.jwt.signAsync(payload);
    }

    async verifyJwtTokenAsync(token: string): Promise<JwtPayload> {
        return await this.jwt.verifyAsync<JwtPayload>(token);
    }

    async generateEmailVerificationTokenAsync(email: string): Promise<string> {
        return await this.jwt.signAsync({ email }, { expiresIn: '2 days' });
    }

    async verifyEmailVerificationTokenAsync(token: string): Promise<string> {
        const { email } = await this.jwt.verify<{ email: string }>(token);
        return email;
    }

    async generatePasswordResetTokenAsync(email: string): Promise<string> {
        return await this.jwt.signAsync({ email }, { expiresIn: '60m' });
    }

    async verifyPasswordResetTokenAsync(token: string): Promise<string> {
        const { email } = await this.jwt.verify<{ email: string }>(token);
        return email;
    }

    async generateOtpResetTokenAsync(email: string, verificationCode: string): Promise<string> {
        const verificationCodeHash = await hash(verificationCode, await genSalt(10));
        const token = await this.jwt.signAsync({ verificationCodeHash, email }, { expiresIn: '10m' });
        return token;
    }

    async verifyOtpResetTokenAsync(token: string): Promise<{ email: string; verificationCodeHash: string }> {
        const obj = await this.jwt.verify<{ email: string; verificationCodeHash: string }>(token);

        return obj;
    }

    async buildJwtPayload(user: User): Promise<string> {
        const {
            id,
            email,
            doctor,
            patient,
            manager,
            firstName,
            lastName,
            details: { avatar, phoneNumber },
            userRoles,
        } = user;

        if (!userRoles.length) {
            throw new NotFoundException(ErrorCode.USER_WITHOUT_ROLE);
        }

        const roles = userRoles.map((ur) => ur.role.name);

        const jwtPayload: JwtPayload = {
            id,
            email,
            firstName,
            lastName,
            phoneNumber,
            avatar,
            roles,
            doctor,
            manager,
            patient,
        };

        if (roles.includes(RoleName.Patient)) {
            if (!patient) {
                throw new NotFoundException(ErrorCode.PATIENT_NOT_FOUND);
            }

            jwtPayload.patient.id = patient.id;
        }

        if (roles.includes(RoleName.Doctor)) {
            if (!doctor) {
                throw new NotFoundException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            jwtPayload.doctor.id = doctor.id;
        }

        if (roles.includes(RoleName.Manager)) {
            if (!manager) {
                throw new NotFoundException(ErrorCode.MANAGER_NOT_FOUND);
            }

            jwtPayload.manager.id = manager.id;
        }

        if (avatar) {
            jwtPayload.avatar = { url: avatar.url };
        }

        const accessToken = await this.generateJwtTokenAsync(jwtPayload);

        return accessToken;
    }

    getPermission(permissions: JwtPermission[], currentPermissionName: string): JwtPermission {
        const permission = permissions.find((p) => p.name === currentPermissionName);

        if (!permission) {
            throw new ForbiddenException(ErrorCode.PERMISSION_DENIED);
        }
        return permission;
    }

    async getPermissionsByUserId(id: string): Promise<JwtPermission[]> {
        const userPermissions = await this.dbContext.userPermissions.find({
            where: { userId: id },
            relations: ['permission', 'parameter'],
        });

        const permissions: JwtPermission[] = userPermissions.map((up) => {
            const { permission, parameter } = up;
            return {
                id: permission.id,
                name: permission.name,
                value: parameter.value,
            };
        });

        return permissions;
    }

    async generateOtpVerifyTokenAsync(email: string, verificationCode: string): Promise<string> {
        const verificationCodeHash = await hash(verificationCode, await genSalt(10));
        const token = await this.jwt.signAsync({ verificationCodeHash, email }, { expiresIn: '5m' });
        return token;
    }

    async verifyOtpAsync(otp: string, otpVerificationToken: string): Promise<boolean> {
        const { verificationCodeHash } = await this.jwt.verifyAsync<{ verificationCodeHash: string }>(
            otpVerificationToken,
        );

        return await compare(otp, verificationCodeHash);
    }

    async activateAccount(email: string): Promise<void> {
        const emailVerificationToken = await this.generateEmailVerificationTokenAsync(email);

        await this.commandBus.execute(new ActivateAccountCommand(emailVerificationToken));
    }
}
