import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1727365407545 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name    : 'Users',
                columns : [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    {
                        name       : 'status',
                        type       : 'enum',
                        enum       : [ 'ACTIVE', 'BLOCKED' ],
                        default    : "'ACTIVE'", // Solution for bug in TypeORM
                        isNullable : false
                    },
                    { name: 'email', type: 'varchar', isNullable: false, isUnique: true },
                    { name: 'firstName', type: 'varchar', isNullable: false },
                    { name: 'lastName', type: 'varchar', isNullable: false },
                    { name: 'avatarPath', type: 'varchar', isNullable: false },
                    { name: 'passwordHash', type: 'varchar', isNullable: false },
                    { name: 'salt', type: 'varchar', isNullable: false },
                    { name: 'createdAt', type: 'datetime', isNullable: false, default: 'NOW()' },
                    { name: 'updatedAt', type: 'datetime', isNullable: false, default: 'NOW()' }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Users');
    }
}
