import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '@app/article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ default: '' })
    bio: string;

    @Column()
    username: string;

    @Column({ default: '' })
    image: string;

    @Column({ select: false })
    password: string;

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];

    @ManyToMany(() => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10)
    }

    @BeforeUpdate()
    async updateHashPassword() { // when do update, not save, this method not calls at all
        if (this.password) {
            this.password = await hash(this.password, 10);
        }
    }
}