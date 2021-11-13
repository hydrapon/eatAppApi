import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { usersProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ...usersProviders,
  ],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule)
  ]
})
export class UserModule { }
