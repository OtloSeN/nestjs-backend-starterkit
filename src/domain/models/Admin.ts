import crypto                                                                         from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { KEY_LENGTH, SALT_LENGTH }                                                    from '@common/constants';
import { BadRequestException }                                                        from '@common/exceptions';
import { IAdminRegisterParams, IAdminAuthenticateParams }                             from './interfaces/IAdmin';
import BaseEntity                                                                     from './BaseEntity';

@Entity({ name: 'Admins' })
export default class Admin extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id : number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email : string;

    @Column({ type: 'varchar', nullable: false })
    passwordHash : string;

    @Column({ type: 'varchar', nullable: false })
    salt : string;

    @CreateDateColumn({ type: 'datetime', nullable: false })
    createdAt : Date;

    @UpdateDateColumn({ type: 'datetime', nullable: false })
    updatedAt : Date;

    private static readonly SALT_LENGTH = SALT_LENGTH;

    private static readonly KEY_LENGTH = KEY_LENGTH;

    static async register(data: IAdminRegisterParams) {
        const salt = this.generateSalt();

        const passwordHash = this.hashPassword(data.password, salt);

        return this.createAndSave({
            ...data,
            passwordHash,
            salt
        });
    }

    private static generateSalt() {
        return crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    }

    private static hashPassword(password: string, salt: string) {
        const hash = crypto.scryptSync(password, salt, Admin.KEY_LENGTH);

        return hash.toString('hex');
    }

    static async authenticate(data: IAdminAuthenticateParams) {
        const admin = await this.findOne({
            where : { email: data.email }
        });

        if (!admin || !admin.checkPassword(data.password)) {
            throw new BadRequestException({
                code : 'EMAIL_OR_PASSWORD_WRONG'
            });
        }

        return admin;
    }

    private checkPassword(password: string) {
        const hash = Admin.hashPassword(password, this.salt);

        return hash === this.passwordHash;
    }
}
