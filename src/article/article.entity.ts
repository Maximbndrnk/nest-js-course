import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column('simple-array')
    tagList: string[];


    @Column({ default: 0 })
    favoritesCount: number;


    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }


}