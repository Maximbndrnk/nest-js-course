import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/user-response.model';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { UserDecorator } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller()
export class UserController {

    constructor(
        private userService: UserService,
    ) {
    }

    @ApiBody({ type: CreateUserDto })
    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDTO: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDTO);
        return this.userService.buildUserResponse(user);
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.loginUser(loginUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get('/user')
    @UseGuards(AuthGuard)
    async currentUser(
        // @Req() request: ExpressRequestInterface,
        @UserDecorator() user: UserEntity
    ): Promise<UserResponseInterface> {
        // console.log('usar', user);
        return this.userService.buildUserResponse(user);
    }

    @Put('/user')
    @UseGuards(AuthGuard)
    async updateCurrentUser(
        @Body('user') updateUserDto: UpdateUserDto,
        @UserDecorator() user: UserEntity
    ): Promise<UserResponseInterface> {
        const updatedUser = await this.userService.updateUser(user.id, updateUserDto);
        return this.userService.buildUserResponse(updatedUser);
    }
}
