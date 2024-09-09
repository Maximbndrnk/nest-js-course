import { ArticleEntity } from '@app/article/article.entity';

export interface ArticleResponseInterface {
    article: ArticleType;
}

export type ArticleType = Omit<ArticleEntity, 'updateTimestamp'>