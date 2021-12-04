import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import * as ormPgConfig from './database/config/type-orm-pg.config';
import { MailerModule } from "@nestjs-modules/mailer";
import * as mailerConfig from "./common/config/mail.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormPgConfig),
    AuthModule,
    UsersModule,
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
