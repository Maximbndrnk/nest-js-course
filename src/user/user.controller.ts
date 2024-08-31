import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/user-response.model';

@Controller()
export class UserController {

    constructor(
        private userService: UserService,
    ) {
    }

    @Post('users')
    async createUser(@Body('user') createUserDTO: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDTO);
        return this.userService.buildUserResponse(user);
    }
}
