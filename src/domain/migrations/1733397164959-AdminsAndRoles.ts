import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AdminsAndRoles1733397164959 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name    : 'Roles',
            columns : [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'permissions', type: 'json', isNullable: false },
                { name: 'createdAt', type: 'datetime', isNullable: false, default: 'NOW()' },
                { name: 'updatedAt', type: 'datetime', isNullable: false, default: 'NOW()' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name    : 'Admins',
            columns : [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'roleId', type: 'int', isNullable: false },
                { name: 'email', type: 'varchar', isNullable: false, isUnique: true },
                { name: 'firstName', type: 'varchar', isNullable: false },
                { name: 'lastName', type: 'varchar', isNullable: false },
                { name: 'passwordHash', type: 'varchar', isNullable: false },
                { name: 'salt', type: 'varchar', isNullable: false },
                { name: 'createdAt', type: 'datetime', isNullable: false, default: 'NOW()' },
                { name: 'updatedAt', type: 'datetime', isNullable: false, default: 'NOW()' }
            ],
            foreignKeys : [
                {
                    columnNames           : [ 'roleId' ],
                    referencedColumnNames : [ 'id' ],
                    referencedTableName   : 'Roles'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Admins');
        await queryRunner.dropTable('Roles');
    }
}
