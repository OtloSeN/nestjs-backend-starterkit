import crypto                                                                                    from 'crypto';
import { promisify }                                                                             from 'util';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { KEY_LENGTH, SALT_LENGTH }                                                               from '@common/constants';
import { BadRequestException }                                                                   from '@common/exceptions';
import { IAdminRegisterParams, IAdminUpdateMeParams, IAdminUpdateInstanceParams }                from './interfaces/IAdmin';
import BaseEntity                                                                                from './BaseEntity';
import Role                                                                                      from './Role';

const scryptAsync = promisify(crypto.scrypt);

const MIN_PASSWORD_LENGTH = 8; // eslint-disable-line more/no-hardcoded-password

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

    static readonly MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH;

    static async register(data: IAdminRegisterParams) {
        await Role.findOneOrThrow({ where: { id: data.roleId } });

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

    async checkPassword(password: string) {
        const hash = await Admin.hashPassword(password, this.salt);

        return hash === this.passwordHash;
    }

    async updateMe(data: IAdminUpdateMeParams) {
        const dataToUpdate: {
            firstName?    : string;
            lastName?     : string;
            passwordHash? : string;
            salt?         : string;
        } = {
            firstName : data.firstName,
            lastName  : data.lastName
        };

        if (data.password && data.oldPassword) {
            if (!await this.checkPassword(data.oldPassword)) {
                throw new BadRequestException({ code: 'WRONG_OLD_PASSWORD' });
            }

            dataToUpdate.salt = Admin.generateSalt();
            dataToUpdate.passwordHash = await Admin.hashPassword(data.password, dataToUpdate.salt);
        }

        await this.update(dataToUpdate as this);
    }

    async updateInstance(data: IAdminUpdateInstanceParams) {
        if (data.roleId) {
            await Role.findOneOrThrow({ where: { id: data.roleId } });
        }

        const dataToUpdate: {
            roleId?       : number;
            firstName?    : string;
            lastName?     : string;
            passwordHash? : string;
            salt?         : string;
        } = {
            roleId    : data.roleId,
            firstName : data.firstName,
            lastName  : data.lastName
        };

        if (data.password) {
            dataToUpdate.salt = Admin.generateSalt();
            dataToUpdate.passwordHash = await Admin.hashPassword(data.password, dataToUpdate.salt);
        }

        await this.update(dataToUpdate as this);
    }

    async deleteInstance() {
        return this.remove();
    }
}
