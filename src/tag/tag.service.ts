import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
    constructor() {
    }


    findAll(): string[]{
        return ['dragons', 'coffee','weather', 'pokemons'];
    }
}
