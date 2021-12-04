import { UserAuthDto } from 'src/modules/auth/dto/user.auth.dto';

export interface UserAuthRequest extends Request {
  user: UserAuthDto
}