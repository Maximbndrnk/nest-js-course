import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserDecorator } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';

@Controller('articles')
export class ArticleController {

    constructor(
        private readonly articleService: ArticleService
    ) {
    }

    @Post()
    @UseGuards(AuthGuard, AuthGuard)
    async create(
        @UserDecorator() currentUser: UserEntity,
        @Body('article') article: CreateArticleDto
    ): Promise<any> {
        return this.articleService.createArticle(currentUser, article);
    }
}
