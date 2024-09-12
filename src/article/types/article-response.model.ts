import { ArticleEntity } from '@app/article/article.entity';

export interface ArticleResponseInterface {
    article: ArticleType;
}

export interface ArticlesResponseInterface {
    articles: ArticleType[];
    articlesCount: number;
}

export type ArticleType = Omit<ArticleEntity, 'updateTimestamp'>