import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserDecorator } from '@app/user/decorators/user.decorator';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';

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

}

