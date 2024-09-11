import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { ArticleResponseInterface } from '@app/article/types/article-response.model';
import slugify from 'slugify';
import { UpdateArticleDto } from '@app/article/dto/updateArticle.dto';

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
        return this.articleRepository.findOne(
            { where: { slug } }
        );
    }

    private getSlug(title: string): string {
        return (
            slugify(title, { lower: true }) + '-' +
            (((Math.random() * Math.pow(36, 5))) | 0).toString(36)
        )
    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.getBySlug(slug);
        if (!article){
            throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
        }

        if (article.author.id != currentUserId){
            throw new HttpException('U are not an author', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({slug});
    }

    async updateArticle(
        articleDto: UpdateArticleDto,
        slug: string,
        currentUserId: number
    ): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        if (!article){
            throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
        }

        if (article.author.id != currentUserId){
            throw new HttpException('U are not an author', HttpStatus.FORBIDDEN);
        }

        Object.assign(article, articleDto);
        article.slug = this.getSlug(article.title);

        console.log('art', article);
        return await this.articleRepository.save(article);
    }
}
