import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserDecorator } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface, ArticlesResponseInterface } from '@app/article/types/article-response.model';
import { UpdateArticleDto } from '@app/article/dto/updateArticle.dto';

@Controller('articles')
export class ArticleController {

    constructor(
        private readonly articleService: ArticleService
    ) {
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(
        @UserDecorator('id') currentUserId: number,
        @Query() query: any,
    ):Promise<ArticlesResponseInterface>{
        return await this.articleService.findAll(currentUserId, query);
    }

    @Post()
    @UseGuards(AuthGuard, AuthGuard)
    @UsePipes(new ValidationPipe())
    async create(
        @UserDecorator() currentUser: UserEntity,
        @Body('article') article: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
        const a = await this.articleService.createArticle(currentUser, article);
        return this.articleService.buildArticleResponse(a);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorites(
        @UserDecorator('id') currentUserId: number,
        @Param('slug') slug: string,
    ): Promise<ArticleResponseInterface> {
        const a = await this.articleService.addArticleToFavorites(slug,currentUserId);
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

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async updateArticle(
        @Body('article') article: UpdateArticleDto,
        @Param('slug') slug: string,
        @UserDecorator('id') currentUserId: number,
    ): Promise<ArticleResponseInterface> {
        const a = await this.articleService.updateArticle(article, slug, currentUserId);
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
