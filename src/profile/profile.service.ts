import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { ProfileType } from '@app/profile/types/profile.type';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {
    }


    async getProfile(currentUserId: number, username: string): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: { username }
        })
        if (!user) {
            throw new HttpException('Profile does not exists', HttpStatus.NOT_FOUND);
        }

        return { ...user, following: false };
    }

    buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
        delete profile.email;
        return {
            profile
        }
    }
}
