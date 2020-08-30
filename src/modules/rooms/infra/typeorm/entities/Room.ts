import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('rooms')
export default class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(_type => User, host => host.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'host_id' })
  host: User;

  @ManyToMany(_type => User, user => user.rooms, {
    eager: true,
  })
  @JoinTable({
    name: 'room_users',
    joinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  participants: User[];

  @Column()
  capacity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
