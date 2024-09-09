import { Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';

@Controller('articles')
export class ArticleController {

    constructor(
        private readonly articleService: ArticleService
    ) {
    }

    @Post()
    async create(): Promise<any> {
        return this.articleService.createArticle();
    }
}
