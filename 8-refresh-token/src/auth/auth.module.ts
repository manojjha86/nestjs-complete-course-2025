import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import authConfig from './config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider 
  }],
  imports: [
    forwardRef(() => UsersModule), 
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider())
  ],
  exports: [AuthService, HashingProvider]
})
export class AuthModule {}
