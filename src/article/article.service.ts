import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { ArticleResponseInterface } from '@app/article/types/article-response.model';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    ) {
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
        const article = this.articleRepository.findOne(
            { where: { slug } }
        )
        return article;
    }

    private getSlug(title: string): string {
        return (
            slugify(title, { lower: true }) + '-' +
            (((Math.random() * Math.pow(36, 5))) | 0).toString(36)
        )
    }

    async deleteArticle(slug: string, currentUserId: number) {
        return undefined;
    }
}
