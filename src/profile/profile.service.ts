import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { ProfileType } from '@app/profile/types/profile.type';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
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

    async followProfile(currentUserId: number, username: string): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: { username }
        })
        if (!user) {
            throw new HttpException('Profile does not exists', HttpStatus.NOT_FOUND);
        }
        if (currentUserId == user.id) {
            throw new HttpException('You cant follow this user', HttpStatus.BAD_REQUEST)
        }

        const follow = await this.followRepository.findOne({
            where: { followerId: currentUserId, followingId: user.id }
        });
        if (!follow){
            const followToCreate = new FollowEntity();
            followToCreate.followerId = currentUserId;
            followToCreate.followingId = user.id;
            await this.followRepository.save(followToCreate);
        }

        return { ...user, following: true };

    }

    async unfollowProfile(currentUserId: number, username: string) {
        const user = await this.userRepository.findOne({
            where: { username }
        })
        if (!user) {
            throw new HttpException('Profile does not exists', HttpStatus.NOT_FOUND);
        }
        if (currentUserId == user.id) {
            throw new HttpException('You cant unfollow this user', HttpStatus.BAD_REQUEST)
        }
        await this.followRepository.delete({
            followerId: currentUserId, followingId: user.id
        })

        return { ...user, following: false };
    }
}
