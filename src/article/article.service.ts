import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '@app/article/article.entity';

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

        // if (!a.tagList){
        //     a.tagList = [];
        // }

        a.slug = 'currentUser';
        a.author = currentUser;
        return await this.articleRepository.save(a);
    }
}
