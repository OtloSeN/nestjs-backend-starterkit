import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BadRequestException }                                                                   from '@common/exceptions';
import BaseEntity                                                                                from './BaseEntity';
import Admin                                                                                     from './Admin';
import { IRoleCreateRole, IRoleUpdateInstance }                                                  from './interfaces/IRole';

export enum RolePermissions {
    ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
    ADMIN_MANAGEMENT = 'ADMIN_MANAGEMENT',
    USER_MANAGEMENT = 'USER_MANAGEMENT'
}

@Entity({ name: 'Roles' })
export default class Role extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id : number;

    @Column({ type: 'varchar', nullable: false })
    name : string;

    @Column({ type: 'json', nullable: false })
    permissions : RolePermissions[];

    @CreateDateColumn({ type: 'datetime', nullable: false })
    createdAt : Date;

    @UpdateDateColumn({ type: 'datetime', nullable: false })
    updatedAt : Date;

    @OneToMany(() => Admin, admin => admin.role)
    admins : Admin[];

    static createRole(data: IRoleCreateRole) {
        return this.createAndSave({ ...data });
    }

    async updateInstance(data: IRoleUpdateInstance) {
        return this.update(data as this);
    }

    async deleteInstance() {
        const admin = await Admin.findOne({
            where : {
                roleId : this.id
            }
        });

        if (admin) {
            throw new BadRequestException({ code: 'ADMIN_WITH_THIS_ROLE_EXISTS' });
        }

        await this.remove();
    }
}
