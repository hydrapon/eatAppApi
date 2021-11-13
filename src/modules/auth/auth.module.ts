import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { usersProviders } from '../user/user.providers';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '../shared/config/config.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ...usersProviders
  ],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_KEY || 'PRIVATE_KEY'
    }),
    HttpModule
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule { }
