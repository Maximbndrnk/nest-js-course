import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/user/types/user-response.model';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async createUser(createUserDTO: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            where: { email: createUserDTO.email }
        });
        const userByName = await this.userRepository.findOne({
            where: { username: createUserDTO.username }
        });
        if (userByEmail || userByName) {
            throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDTO);
        return await this.userRepository.save(newUser);
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email },
            select: ['id', 'email', 'password', 'image', 'username', 'bio']
        },);
        if (!user) {
            throw new HttpException('Wrong login data', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isPasswordCorrect = await compare(loginUserDto.password, user.password);

        if (!isPasswordCorrect) {
            throw new HttpException('Incorrect password', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        delete user.password;
        return user;
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user),
            }
        }
    }

    generateJwt(u: UserEntity): string {
        return sign({
                id: u.id,
                username: u.username,
                email: u.email
            },
            JWT_SECRET)
            ;
    }
}
