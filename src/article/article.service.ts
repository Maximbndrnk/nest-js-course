import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { ArticleResponseInterface, ArticlesResponseInterface } from '@app/article/types/article-response.model';
import slugify from 'slugify';
import { UpdateArticleDto } from '@app/article/dto/updateArticle.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private dataSource: DataSource,
    ) {
    }

    async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = this.dataSource.getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');

        queryBuilder.orderBy('articles.createdAt', 'DESC');
        // important to put it at the very top - to know how many records in database
        const articlesCount = await queryBuilder.getCount();

        if (query?.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${query.tag}%`
            })
        }

        if (query?.author) {
            const author = await this.userRepository.findOne({
                where: { username: query?.author }
            });
            queryBuilder.andWhere('articles.authorId = :id', {
                id: author.id
            })
        }

        if (query?.limit) {
            queryBuilder.limit(query?.limit);
        }
        if (query?.offset) {
            queryBuilder.offset(query?.offset);
        }

        const articles = await queryBuilder.getMany();


        return { articles, articlesCount };
    }

    async createArticle(
        currentUser: UserEntity,
        articleDto: CreateArticleDto
    ): Promise<ArticleEntity> {
        const a = new ArticleEntity();
        Object.assign(a, articleDto);

        a.slug = this.getSlug(a.title);
        a.author = currentUser;
        return await this.articleRepository.save(a);
    }

    buildArticleResponse(a: ArticleEntity): ArticleResponseInterface {
        return {
            article: a
        }
    }

    async getBySlug(slug: string): Promise<ArticleEntity> {
        return this.articleRepository.findOne(
            { where: { slug } }
        );
    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.getBySlug(slug);
        if (!article) {
            throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
        }

        if (article.author.id != currentUserId) {
            throw new HttpException('U are not an author', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({ slug });
    }

    async updateArticle(
        articleDto: UpdateArticleDto,
        slug: string,
        currentUserId: number
    ): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        if (!article) {
            throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
        }

        if (article.author.id != currentUserId) {
            throw new HttpException('U are not an author', HttpStatus.FORBIDDEN);
        }

        Object.assign(article, articleDto);
        article.slug = this.getSlug(article.title);

        return await this.articleRepository.save(article);
    }

    async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        const user = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: ['favorites']
        });

        const isNotFavorite = user.favorites.findIndex((a: ArticleEntity) => a.id === article.id) === -1;

        if (isNotFavorite) {
            user.favorites.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    private getSlug(title: string): string {
        return (
            slugify(title, { lower: true }) + '-' +
            (((Math.random() * Math.pow(36, 5))) | 0).toString(36)
        )
    }
}
