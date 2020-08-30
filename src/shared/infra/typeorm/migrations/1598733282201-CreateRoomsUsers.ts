import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateRoomsUsers1598733282201
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rooms',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'host_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'capacity',
            type: 'integer',
            default: 5,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'hostId',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['host_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: 'room_users',
        columns: [
          {
            name: 'room_id',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'roomId',
            referencedTableName: 'rooms',
            referencedColumnNames: ['id'],
            columnNames: ['room_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'userId',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('room_users', 'userId');
    await queryRunner.dropForeignKey('room_users', 'roomId');
    await queryRunner.dropForeignKey('rooms', 'hostId');
    await queryRunner.dropTable('room_users');
    await queryRunner.dropTable('rooms');
  }
}
