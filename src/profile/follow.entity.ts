import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'follows' })
export class FollowEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId: number;

    @Column()
    followingId: number;

}