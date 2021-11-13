import { User } from './user.entity';
import { USERS_REPOSITORY } from '../../utils/keys';

export const usersProviders = [
    {
        provide: USERS_REPOSITORY,
        useValue: User,
    },
];