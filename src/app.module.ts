import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { SharedModule } from './modules/shared/shared.module';


@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    SharedModule
  ],
  controllers: [
    // AppController
  ],
  providers: [
    // AppService
  ],
})
export class AppModule { }
