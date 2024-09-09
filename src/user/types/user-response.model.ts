import { UserEntity } from '@app/user/user.entity';

export interface UserResponseInterface {
    user: UserType & { token: string };
}

export type UserType = Omit<UserEntity, 'hashPassword' | 'updateHashPassword'>