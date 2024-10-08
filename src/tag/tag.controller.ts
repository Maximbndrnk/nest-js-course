import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagController {
    constructor(
        private tagService: TagService
    ) {
    }

    @Get()
    async findAll(): Promise<{ tags: string[] }> {
        const tags = await this.tagService.findAll();
        return {
            tags: tags.map(t => t.name),
        }
    }

}
