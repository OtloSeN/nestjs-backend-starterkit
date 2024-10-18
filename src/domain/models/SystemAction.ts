import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { BadRequestException }                                                 from '@nestjs/common';
import { DateTime }                                                            from 'luxon';
import { SYSTEM_ACTION_EXPIRES_IN }                                            from '@common/constants';
import BaseEntity                                                              from './BaseEntity';
import User                                                                    from './User';

export enum SystemActionTypes {
    PASSWORD_RESET = 'PASSWORD_RESET'
}

@Entity({ name: 'SystemActions' })
export default class SystemAction extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'int', nullable: false })
    userId : number;

    @Column({ type: 'enum', enum: SystemActionTypes, nullable: false })
    type : SystemActionTypes;

    @Column({ type: 'json', nullable: true })
    payload : object | null;

    @Column({ type: 'datetime', nullable: false })
    expiresAt : Date;

    @CreateDateColumn({ type: 'datetime', nullable: false })
    createdAt : Date;

    @ManyToOne(() => User, user => user.systemActions)
    user : User;

    static createPasswordResetAction(userId: number) {
        return SystemAction.createAndSave({
            userId,
            type      : SystemActionTypes.PASSWORD_RESET,
            expiresAt : DateTime.utc().plus({ minutes: SYSTEM_ACTION_EXPIRES_IN }).toJSDate()
        });
    }

    validate() {
        if (this.expiresAt < DateTime.utc().toJSDate()) {
            throw new BadRequestException({ code: 'SYSTEM_ACTION_EXPIRED' });
        }
    }
}
