import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';

export const UserDecorator = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ExpressRequestInterface>();
    if (!req.user) {
        return null;
    }

    if (data) {
        return req.user[data];
    }

    return req.user;
})