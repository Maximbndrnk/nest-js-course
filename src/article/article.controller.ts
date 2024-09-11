import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserDecorator } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface } from '@app/article/types/article-response.model';

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
    ): Promise<ArticleResponseInterface> {
        const a = await this.articleService.createArticle(currentUser, article);
        return this.articleService.buildArticleResponse(a);
    }

    @Get()
    @UseGuards(AuthGuard)
    async getBySlug(
        @Query('slug') slug: string,
        // @Query('id') id: string,
    ): Promise<ArticleResponseInterface> {
        const a = await this.articleService.getBySlug(slug);
        return this.articleService.buildArticleResponse(a);
    }

    @Get(':slug')
    @UseGuards(AuthGuard)
    async getBySlugV2(
        @Param('slug') slug: string,
    ): Promise<ArticleResponseInterface> {
        const a = await this.articleService.getBySlug(slug);
        return this.articleService.buildArticleResponse(a);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(
        @Param('slug') slug: string,
        @UserDecorator('id') currentUserId: number,
    ) {
      return await this.articleService.deleteArticle(slug, currentUserId);
    }
}
