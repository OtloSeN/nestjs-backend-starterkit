import crypto                                                                                    from 'crypto';
import { extname }                                                                               from 'path';
import { promisify }                                                                             from 'util';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { KEY_LENGTH, SALT_LENGTH }                                                               from '@common/constants';
import { BadRequestException }                                                                   from '@common/exceptions';
import BaseEntity                                                                                from './BaseEntity';
import { IUserRegisterData, IUserUpdateProfileData }                                             from './interfaces/IUser';
import File                                                                                      from './File';
import SystemAction                                                                              from './SystemAction';

const scryptAsync = promisify(crypto.scrypt);

export enum UserStatuses {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED'
}

const MIN_PASSWORD_LENGTH = 8; // eslint-disable-line more/no-hardcoded-password

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id : number;

    @Column({ type: 'enum', enum: UserStatuses, nullable: false, default: UserStatuses.BLOCKED })
    status : UserStatuses;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email : string;

    @Column({ type: 'varchar', nullable: false })
    firstName : string;

    @Column({ type: 'varchar', nullable: false })
    lastName : string;

    @Column({ type: 'varchar', nullable: false })
    avatarPath : string;

    @Column({ type: 'varchar', nullable: false })
    passwordHash : string;

    @Column({ type: 'varchar', nullable: false })
    salt : string;

    @CreateDateColumn({ type: 'datetime', nullable: false })
    createdAt : Date;

    @UpdateDateColumn({ type: 'datetime', nullable: false })
    updatedAt : Date;

    @OneToMany(() => SystemAction, systemAction => systemAction.user)
    systemActions : SystemAction[];

    private static readonly SALT_LENGTH = SALT_LENGTH;

    private static readonly KEY_LENGTH = KEY_LENGTH;

    static readonly MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH;

    static readonly AVATAR_DIR = 'users/avatars';

    static getAvatarPath(originalname: string) {
        return `${this.AVATAR_DIR}/${crypto.randomUUID()}${extname(originalname)}`;
    }

    static async register(data: IUserRegisterData) {
        const salt = this.generateSalt();
        const passwordHash = await this.hashPassword(data.password, salt);

        const avatarPath = this.getAvatarPath(data.avatar.originalname);

        const user = await this.createAndSave({
            ...data,
            avatarPath,
            passwordHash,
            salt
        });

        await File.uploadFile({
            path     : avatarPath,
            filepath : data.avatar.path,
            mimetype : data.avatar.mimetype
        });

        return user;
    }

    private static generateSalt() {
        return crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    }

    private static async hashPassword(password: string, salt: string) {
        const hash = await scryptAsync(password, salt, this.KEY_LENGTH) as Buffer;

        return hash.toString('hex');
    }

    async checkPassword(password: string) {
        const hash = await User.hashPassword(password, this.salt);

        return hash === this.passwordHash;
    }

    async resetPassword(newPassword: string) {
        const salt = User.generateSalt();
        const passwordHash = await User.hashPassword(newPassword, salt);

        await this.update({
            salt,
            passwordHash
        } as this);
    }

    async updateProfile(data: IUserUpdateProfileData) {
        const dataToUpdate: {
            firstName?    : string;
            lastName?     : string;
            avatarPath?   : string;
            passwordHash? : string;
            salt?         : string;
        } = {
            firstName : data.firstName,
            lastName  : data.lastName
        };

        const promises = [];

        if (data.avatar) {
            const avatarPath = User.getAvatarPath(data.avatar.originalname);

            promises.push(
                File.uploadFile({
                    path     : avatarPath,
                    filepath : data.avatar.path,
                    mimetype : data.avatar.mimetype
                }),
                File.deleteFile({ path: this.avatarPath })
            );

            dataToUpdate.avatarPath = avatarPath;
        }

        if (data.password && data.oldPassword) {
            if (!await this.checkPassword(data.oldPassword)) {
                throw new BadRequestException({ code: 'WRONG_OLD_PASSWORD' });
            }

            dataToUpdate.salt = User.generateSalt();
            dataToUpdate.passwordHash = await User.hashPassword(data.password, dataToUpdate.salt);
        }

        await this.update(dataToUpdate as this);

        await Promise.all(promises);
    }

    async deleteProfile() {
        await this.remove();

        await File.deleteFile({ path: this.avatarPath });
    }
}
