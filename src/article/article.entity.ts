import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    body: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
    createdAt: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'simple-array', default: [] })
    tagList: string[];

    @Column({ default: 0 })
    favoritesCount: number;

    @ManyToOne(() => UserEntity, (user) => user.articles)
    author: UserEntity;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }


}