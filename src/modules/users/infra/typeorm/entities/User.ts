import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Room from '@modules/rooms/infra/typeorm/entities/Room';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  mobile_token: string;

  @OneToOne(_type => Room, room => room.id, {
    cascade: true,
  })
  host_room: Room;

  @ManyToMany(_type => Room, room => room.participants)
  rooms: Room[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
