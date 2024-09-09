import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {

    async createArticle(): Promise<any>{
        return 'c a'as any;
    }
}
