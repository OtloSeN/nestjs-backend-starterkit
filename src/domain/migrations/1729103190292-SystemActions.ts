import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class SystemActions1729103190292 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name    : 'SystemActions',
                columns : [
                    { name: 'id', type: 'char', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                    { name: 'userId', type: 'int', isNullable: false },
                    { name: 'type', type: 'enum', enum: [ 'PASSWORD_RESET' ], isNullable: false },
                    { name: 'payload', type: 'json', isNullable: true },
                    { name: 'expiresAt', type: 'datetime', isNullable: true },
                    { name: 'createdAt', type: 'datetime', isNullable: false, default: 'NOW()' }
                ],
                foreignKeys : [
                    {
                        columnNames           : [ 'userId' ],
                        referencedColumnNames : [ 'id' ],
                        referencedTableName   : 'Users',
                        onDelete              : 'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('SystemActions');
    }
}
