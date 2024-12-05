import crypto                                                                                    from 'crypto';
import { promisify }                                                                             from 'util';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { KEY_LENGTH, SALT_LENGTH }                                                               from '@common/constants';
import { BadRequestException }                                                                   from '@common/exceptions';
import { IAdminRegisterParams, IAdminAuthenticateParams }                                        from './interfaces/IAdmin';
import BaseEntity                                                                                from './BaseEntity';
import Role                                                                                      from './Role';

const scryptAsync = promisify(crypto.scrypt);

@Entity({ name: 'Admins' })
export default class Admin extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id : number;

    @Column({ type: 'int', nullable: false })
    roleId : number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email : string;

    @Column({ type: 'varchar', nullable: false })
    firstName : string;

    @Column({ type: 'varchar', nullable: false })
    lastName : string;

    @Column({ type: 'varchar', nullable: false })
    passwordHash : string;

    @Column({ type: 'varchar', nullable: false })
    salt : string;

    @CreateDateColumn({ type: 'datetime', nullable: false })
    createdAt : Date;

    @UpdateDateColumn({ type: 'datetime', nullable: false })
    updatedAt : Date;

    @ManyToOne(() => Role, role => role.admins)
    role : Role;

    private static readonly SALT_LENGTH = SALT_LENGTH;

    private static readonly KEY_LENGTH = KEY_LENGTH;

    static async register(data: IAdminRegisterParams) {
        const salt = this.generateSalt();

        const passwordHash = await this.hashPassword(data.password, salt);

        return this.createAndSave({
            ...data,
            passwordHash,
            salt
        });
    }

    private static generateSalt() {
        return crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    }

    private static async hashPassword(password: string, salt: string) {
        const hash = await scryptAsync(password, salt, Admin.KEY_LENGTH) as Buffer;

        return hash.toString('hex');
    }

    static async authenticate(data: IAdminAuthenticateParams) {
        const admin = await this.findOne({
            where : { email: data.email }
        });

        if (!admin || !await admin.checkPassword(data.password)) {
            throw new BadRequestException({
                code : 'EMAIL_OR_PASSWORD_WRONG'
            });
        }

        return admin;
    }

    async checkPassword(password: string) {
        const hash = await Admin.hashPassword(password, this.salt);

        return hash === this.passwordHash;
    }
}
