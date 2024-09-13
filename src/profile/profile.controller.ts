import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserDecorator } from '@app/user/decorators/user.decorator';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { ArticleResponseInterface } from '@app/article/types/article-response.model';

@Controller('profiles')
export class ProfileController {

    constructor(
        private readonly profileService: ProfileService) {
    }

    @Get(':username')
    async getProfileBySlug(
        @UserDecorator('id') currentUserId: number,
        @Param('username') username: string,
    ): Promise<ProfileResponseInterface> {
        console.log('username', username);
        const profile = await this.profileService.getProfile(currentUserId, username);
        return this.profileService.buildProfileResponse(profile);
    }


    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(
        @UserDecorator('id') currentUserId: number,
        @Param('username') username: string,
    ): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.followProfile(currentUserId, username);
        return this.profileService.buildProfileResponse(profile);
    }
    @Delete(':username/follow')
    @UseGuards(AuthGuard)
    async unfollowProfile(
        @UserDecorator('id') currentUserId: number,
        @Param('username') username: string,
    ): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.unfollowProfile(currentUserId, username);
        return this.profileService.buildProfileResponse(profile);
    }

}

