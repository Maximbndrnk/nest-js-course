import { UserType } from '@app/user/types/user-response.model';

export type ProfileType = UserType & { following: boolean };