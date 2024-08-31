import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor() {
    }

    async createUser(): Promise<any> {
        return await 'createUser';
    }
}
